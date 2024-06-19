import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ApplyCouponDto {
  @IsInt()
  @ApiProperty({
    description: 'The ID of the order to apply the coupon to',
    example: 1,
  })
  orderId: number;

  @IsString()
  @ApiProperty({
    description: 'The coupon code to apply to the order',
    example: 'SUMMER25',
  })
  couponCode: string;
}
