import { Controller, Post, Get, Put, Body, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { ApplyCouponDto } from './dto/apply-coupon.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('orders')
@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({ type: CreateOrderDto })
  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(createOrderDto);
  }

  @ApiOperation({ summary: 'Get order by ID' })
  @ApiParam({ name: 'orderId', type: Number })
  @Get(':orderId')
  async getOrderById(@Param('orderId') orderId: string) {
    const parsedOrderId = parseInt(orderId, 10); 
    return this.ordersService.getOrderById(parsedOrderId);
  }

  @ApiOperation({ summary: 'Update order status' })
  @ApiParam({ name: 'orderId', type: String })
  @ApiBody({ description: 'Status to update', type: UpdateOrderStatusDto })
  @Put(':orderId/status')
  async updateOrderStatus(@Param('orderId') orderId: string, @Body() updateOrderStatusDto: UpdateOrderStatusDto) {
    const parsedOrderId = parseInt(orderId, 10); 
    return this.ordersService.updateOrderStatus(parsedOrderId, updateOrderStatusDto);
  }

  @ApiOperation({ summary: 'Apply coupon to order' })
  @ApiBody({ type: ApplyCouponDto })
  @Post('apply-coupon')
  async applyCoupon(@Body() applyCouponDto: ApplyCouponDto) {
    return this.ordersService.applyCoupon(applyCouponDto);
  }
}

@ApiTags('users')
@Controller('api/users')
export class UsersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Get order history for user' })
  @ApiParam({ name: 'userId', type: Number })
  @Get(':userId/orders')
  async getOrderHistory(@Param('userId') userId: number) {
    return this.ordersService.findOrdersByUserId(userId);
  }
}