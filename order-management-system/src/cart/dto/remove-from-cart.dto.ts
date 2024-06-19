import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RemoveFromCartDto {
  @IsInt()
  @ApiProperty({
    description: 'The ID of the user who owns the cart',
    example: 1,
  })
  userId: number;

  @IsInt()
  @ApiProperty({
    description: 'The ID of the product to remove from the cart',
    example: 123,
  })
  productId: number;
}
