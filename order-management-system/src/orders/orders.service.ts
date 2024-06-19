import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApplyCouponDto } from './dto/apply-coupon.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    const { userId } = createOrderDto;

    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    const totalPrice = cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0);

    const order = await this.prisma.order.create({
      data: {
        userId,
        status: 'pending',
        price: totalPrice,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: { items: true },
    });

    await Promise.all(
      cart.items.map(async (item) => {
        const product = await this.prisma.product.findUnique({
          where: { productId: item.productId },
        });

        if (!product) {
          throw new NotFoundException(`Product with ID ${item.productId} not found.`);
        }

        await this.prisma.product.update({
          where: { productId: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      })
    );

    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.cartId } });

    return order;
  }

  async getOrderById(orderId: number) {
    return this.prisma.order.findUnique({
      where: { orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async updateOrderStatus(orderId: number, updateOrderStatusDto: UpdateOrderStatusDto) {
    const { status } = updateOrderStatusDto;
    return this.prisma.order.update({
      where: { orderId },
      data: { status },
    });
  }

  async findOrdersByUserId(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async applyCoupon(applyCouponDto: ApplyCouponDto) {
    const { orderId, couponCode } = applyCouponDto;

    const coupon = await this.prisma.coupon.findUnique({
      where: { code: couponCode },
    });

    if (!coupon || new Date(coupon.validUntil) < new Date()) {
      throw new NotFoundException('Invalid or expired coupon.');
    }

    const order = await this.prisma.order.findUnique({
      where: { orderId },
      include: { items: true },
    });

    const discount = coupon.percentage;
    const updatedItems = order.items.map((item) => ({
      ...item,
      price: item.price - item.price * discount,
    }));

    await Promise.all(
      updatedItems.map((item) =>
        this.prisma.orderItem.update({
          where: { id: item.id },
          data: { price: item.price },
        })
      )
    );

    const updatedTotalPrice = updatedItems.reduce((total, item) => total + item.price * item.quantity, 0);

    await this.prisma.order.update({
      where: { orderId },
      data: { price: updatedTotalPrice },
    });

    return { message: 'Coupon applied successfully', discount };
  }
}
