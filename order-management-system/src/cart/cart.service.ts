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
    let cartItem = await this.prisma.cartItem.findFirst({
      where: {
        cart: {
          userId: userId  // This should match the userId of the cart
        },
        productId: productId
      },
    });
  
    if (cartItem) {
      // If the cart item exists, update the quantity
      const newQuantity = cartItem.quantity + quantity;
      return this.prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      // If the cart item doesn't exist, create a new one
      cartItem = await this.prisma.cartItem.create({
        data: {
          cart: { connect: { userId } },  // Connecting to the user's cart via userId
          product: { connect: { productId } },
          quantity,
        },
      });
  
      return cartItem;
    }
  }
  

  async getCart(userId: number) {
    return this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });
  }

  async updateCart(updateCartDto: UpdateCartDto) {
    const { userId, productId, quantity } = updateCartDto;
  
    // Find the user's cart
    const cart = await this.prisma.cart.findUnique({
      where: { userId: userId },
      include: { items: true },
    });
  
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
  
    // Find the cart item to update
    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.cartId,
        productId,
      },
    });
  
    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }
  
    // Update the cart item quantity
    return this.prisma.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity },
    });
  }
  
  async removeFromCart(removeFromCartDto: RemoveFromCartDto) {
    const { userId, productId } = removeFromCartDto;
  
    // Find the user's cart
    const cart = await this.prisma.cart.findUnique({
      where: { userId: userId },
      include: { items: true },
    });
  
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
  
    // Find the cart item to remove
    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.cartId,
        productId,
      },
    });
  
    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }
  
    // Remove the cart item
    return this.prisma.cartItem.delete({
      where: { id: cartItem.id },
    });
  }
  
}
