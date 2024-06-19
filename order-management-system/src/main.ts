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

  // Start the NestJS application
  await app.listen(3000);
}

// Seeding function
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

  try {
    for (const user of users) {
      const existingUser = await prisma.user.findUnique({ where: { email: user.email } });
      if (!existingUser) {
        await prisma.user.create({ data: user });
        console.log(`User '${user.name}' added.`);
      } else {
        console.log(`User '${user.name}' already exists, skipping.`);
      }
    }

    for (const product of products) {
      const existingProduct = await prisma.product.findMany({ where: { name: product.name } });
      if (!existingProduct) {
        await prisma.product.create({ data: product });
        console.log(`Product '${product.name}' added.`);
      } else {
        console.log(`Product '${product.name}' already exists, skipping.`);
      }
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

bootstrap();
