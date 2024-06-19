import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { PrismaService } from '../prisma/prisma.service'; 
import { CartController } from './cart.controller';


@Module({
  providers: [CartService, PrismaService], 
  controllers: [CartController],
  exports: [CartService], 
})
export class CartModule {}
