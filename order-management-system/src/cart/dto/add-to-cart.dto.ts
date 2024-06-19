import { IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
  @IsInt()
  @ApiProperty({
    description: 'The ID of the user who owns the cart',
    example: 1,
  })
  userId: number;

  @IsInt()
  @ApiProperty({
    description: 'The ID of the product to add to the cart',
    example: 123,
  })
  productId: number;

  @IsInt()
  @IsPositive()
  @ApiProperty({
    description: 'The quantity of the product to add to the cart',
    example: 2,
  })
  quantity: number;
}
