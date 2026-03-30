// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  await prisma.product.deleteMany(); // optional: clear old data

  await prisma.product.createMany({
    data: [
      {
        name: 'Classic White T-Shirt',
        description: '100% cotton, comfortable and stylish',
        price: 19.99,
        originalPrice: 25.99,
        category: 'T-shirt',
        brand: 'Velmora',
        stock: 50,
        rating: 4.5,
        isNew: true,
        bestSeller: true,
      },
      {
        name: 'Blue Jeans',
        description: 'Slim-fit denim jeans',
        price: 49.99,
        originalPrice: 59.99,
        category: 'Jeans',
        brand: 'DenimPro',
        stock: 30,
        rating: 4.2,
        isNew: false,
        bestSeller: true,
      },
      {
        name: 'Red Hoodie',
        description: 'Warm hoodie with front pocket',
        price: 39.99,
        originalPrice: 49.99,
        category: 'Hoodie',
        brand: 'UrbanWear',
        stock: 20,
        rating: 4.7,
        isNew: true,
        bestSeller: false,
      },
    ],
  });

  console.log('Seeding finished!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());