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

    // Fetch the user's cart with items included
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    // Calculate total price and create order
    const order = await this.prisma.order.create({
      data: {
        userId,
        status: 'pending',
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: { items: true }, // Include items in response for further processing
    });

    // Update product stock after creating order
    await Promise.all(
      cart.items.map(async (item) => {
        const product = await this.prisma.product.findUnique({
          where: { productId: item.productId },
        });

        if (!product) {
          throw new NotFoundException(`Product with ID ${item.productId} not found.`);
        }

        // Update product stock
        await this.prisma.product.update({
          where: { productId: item.productId },
          data: {
            stock: {
              decrement: item.quantity, // Decrement stock by quantity ordered
            },
          },
        });
      })
    );

    // Clear user's cart after order creation
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
    // Placeholder for coupon validation logic
    const discount = await this.validateCoupon(couponCode);

    const order = await this.prisma.order.findUnique({
      where: { orderId },
      include: { items: true },
    });

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

    return { message: 'Coupon applied successfully', discount };
  }

  async validateCoupon(couponCode: string): Promise<number> {
    // Placeholder for coupon validation logic
    return 0.1;
  }
}
