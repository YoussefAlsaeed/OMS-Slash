import { IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartDto {
  @IsInt()
  @ApiProperty({
    description: 'The ID of the user who owns the cart',
    example: 1,
  })
  userId: number;

  @IsInt()
  @ApiProperty({
    description: 'The ID of the product to update in the cart',
    example: 123,
  })
  productId: number;

  @IsInt()
  @IsPositive()
  @ApiProperty({
    description: 'The updated quantity of the product in the cart',
    example: 2,
  })
  quantity: number;
}
