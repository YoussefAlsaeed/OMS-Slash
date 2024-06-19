# E-commerce API

This is an E-commerce API built with NestJS, Prisma, and PostgreSQL. The API allows for managing users, products, carts, orders, and applying coupons.

## Table of Contents
- [Environment Setup](#environment-setup)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)

## Environment Setup

### Prerequisites
Make sure you have the following tools installed:
- Node.js (>= 14.x)
- npm (>= 6.x)
- PostgreSQL (>= 12.x)
- Prisma CLI (>= 3.x)

### Backend Framework
- **NestJS**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.

### ORM
- **Prisma**: Next-generation ORM for Node.js and TypeScript.

### Database
- **PostgreSQL**: A powerful, open-source object-relational database system.

## Installation

1. **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2. **Install dependencies:**
    ```sh
    npm install
    ```

## Database Setup

1. **Create a PostgreSQL database:**
    ```sql
    CREATE DATABASE ecommerce_db;
    ```

2. **Configure database connection:**
    Update your environment variables to include DATABASE_URL with the appropriate connection string.
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce_db"
    ```

3. **Run Prisma migrations:**
    ```sh
    npx prisma migrate dev --name init
    ```

4. **Generate Prisma Client:**
    ```sh
    npx prisma generate
    ```

## Running the Application

   **Start the NestJS application:**
    ```sh
    npm start
    ```

    The API will be running at `http://localhost:3000`.

## API Documentation
   The swagger documentation for apis will be available at:
   http://localhost:3000/api


