import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { RemoveFromCartDto } from './dto/remove-from-cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async addToCart(addToCartDto: AddToCartDto) {
    const { userId, productId, quantity } = addToCartDto;

    // Check if the cart item already exists
    const existingCartItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: userId,
        productId,
      },
    });

    if (existingCartItem) {
      return this.prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
      });
    }

    // If the cart item doesn't exist, create a new one
    return this.prisma.cartItem.create({
      data: {
        cart: { connect: { userId } },
        product: { connect: { productId } },
        quantity,
      },
    });
  }

  async getCart(userId: number) {
    return this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });
  }

  async updateCart(updateCartDto: UpdateCartDto) {
    const { userId, productId, quantity } = updateCartDto;

    // Find the cart item to update
    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: userId,
        productId,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    return this.prisma.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity },
    });
  }

  async removeFromCart(removeFromCartDto: RemoveFromCartDto) {
    const { userId, productId } = removeFromCartDto;

    // Find the cart item to remove
    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: userId,
        productId,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    return this.prisma.cartItem.delete({
      where: { id: cartItem.id },
    });
  }
}
