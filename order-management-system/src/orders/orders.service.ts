import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApplyCouponDto } from './dto/apply-coupon.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from './enums/order-status.enum'; 

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    const { userId } = createOrderDto;
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    const order = await this.prisma.order.create({
      data: {
        userId,
        status: OrderStatus.Pending, 
        items: {
          create: cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
    });

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

    // Check if the order exists
    const order = await this.prisma.order.findUnique({
      where: { orderId },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

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

    const updatedItems = order.items.map(item => ({
      ...item,
      price: item.price - item.price * discount,
    }));

    await Promise.all(
      updatedItems.map(item =>
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
