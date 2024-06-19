import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger'; 

@ApiTags('users') 
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get order history for user' })
  @ApiParam({ name: 'userId', type: Number }) 
  @Get(':userId/orders')
  async getOrderHistory(@Param('userId') userId: string) {
    const parsedUserId = parseInt(userId, 10); 
    return this.usersService.getOrderHistory(parsedUserId);
  }
}