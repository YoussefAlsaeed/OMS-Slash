import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PrismaClient } from '@prisma/client';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prisma seeding logic
  await seedDatabase();

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('E-commerce API')
    .setDescription('API for an e-commerce platform')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

async function seedDatabase() {
  const prisma = new PrismaClient();

  const users = [
    { name: 'Youssef Alsaeed', email: 'youssef.alsaeed@example.com', password: 'password1', address: '123 Main St' },
    { name: 'Ahmed Smith', email: 'ahmed.smith@example.com', password: 'password2', address: '456 New St' },
    { name: 'John Cena', email: 'john.cena@example.com', password: 'password3', address: '789 Old St' }
  ];

  const products = [
    { name: 'Denim Jacket', description: 'Crafted from premium denim', price: 19.99, stock: 100 },
    { name: 'Striped Sweater', description: 'Knitted from soft cotton yarn', price: 29.99, stock: 50 },
    { name: 'Hiking Boots', description: 'Waterproof and durable', price: 15.99, stock: 100 }
  ];

  const coupons = [
    { code: 'SUMMER25', percentage: 0.25, validUntil: new Date('2024-12-31') },
    { code: 'SLASH50', percentage: 0.50, validUntil: new Date('2024-12-31') },
    { code: 'SLASH30', percentage: 0.30, validUntil: new Date('2024-12-31') }
  ];

  try {
    for (const user of users) {
      const existingUser = await prisma.user.findUnique({ where: { email: user.email } });
      if (!existingUser) {
        const newUser = await prisma.user.create({
          data: {
            name: user.name,
            email: user.email,
            password: user.password,
            address: user.address,
            Cart: {
              create: {}
            }
          },
          include: {
            Cart: true
          }
        });
        console.log(`User '${newUser.name}' added with cart.`);
      } else {
        console.log(`User '${existingUser.name}' already exists, skipping.`);
      }
    }

    for (const product of products) {
      const existingProducts = await prisma.product.findMany({ where: { name: product.name } });
      if (existingProducts.length === 0) {
        await prisma.product.create({ data: product });
        console.log(`Product '${product.name}' added.`);
      } else {
        console.log(`Product '${product.name}' already exists, skipping.`);
      }
    }

    for (const coupon of coupons) {
      const existingCoupon = await prisma.coupon.findUnique({ where: { code: coupon.code } });
      if (!existingCoupon) {
        await prisma.coupon.create({ data: coupon });
        console.log(`Coupon '${coupon.code}' added.`);
      } else {
        console.log(`Coupon '${coupon.code}' already exists, skipping.`);
      }
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

bootstrap();
