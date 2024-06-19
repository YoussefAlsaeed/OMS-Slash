import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { RemoveFromCartDto } from './dto/remove-from-cart.dto';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('cart')
@Controller('api/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({ summary: 'Add to cart' })
  @ApiBody({ type: AddToCartDto })
  @Post('add')
  async addToCart(@Body() addToCartDto: AddToCartDto) {
    return this.cartService.addToCart(addToCartDto);
  }

  @ApiOperation({ summary: 'View cart' })
  @ApiParam({ name: 'userId', type: Number })
  @Get(':userId')
  async getCart(@Param('userId') userId: string) {
    const parsedUserId = parseInt(userId, 10); 
    return this.cartService.getCart(parsedUserId);
  }

  @ApiOperation({ summary: 'Update cart' })
  @ApiBody({ type: UpdateCartDto })
  @Put('update')
  async updateCart(@Body() updateCartDto: UpdateCartDto) {
    return this.cartService.updateCart(updateCartDto);
  }

  @ApiOperation({ summary: 'Remove from cart' })
  @ApiBody({ type: RemoveFromCartDto })
  @Delete('remove')
  async removeFromCart(@Body() removeFromCartDto: RemoveFromCartDto) {
    return this.cartService.removeFromCart(removeFromCartDto);
  }
}
