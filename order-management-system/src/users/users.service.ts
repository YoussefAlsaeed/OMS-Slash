import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getOrderHistory(userId: number) {
    // Retrieve user's orders along with associated items
    const userOrders = await this.prisma.user.findUnique({
      where: { userId },
      include: {
        Orders: {
          include: { items: { include: { product: true } } },
        },
      },
    });

    if (!userOrders) {
      throw new NotFoundException('User not found');
    }

    return userOrders.Orders;
  }
}