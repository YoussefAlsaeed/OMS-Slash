import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @IsInt()
  @ApiProperty({
    description: 'The ID of the user creating the order',
    example: 1,
  })
  userId: number;
}
