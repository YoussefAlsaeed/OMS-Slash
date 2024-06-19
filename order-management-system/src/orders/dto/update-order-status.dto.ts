import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { OrderStatus } from '../enums/order-status.enum';

export class UpdateOrderStatusDto {
  @ApiProperty({
    enum: OrderStatus,
    description: 'The status of the order',
    example: OrderStatus.Pending,

  })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
