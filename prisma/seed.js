// prisma/seed.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  adapter: {
    type: 'postgresql',        // your database type
    url: process.env.DATABASE_URL, // make sure this is in your .env
  },
  log: ['query'], // optional: see queries in console
});

async function main() {
  console.log('Seeding database...');

  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: [
      {
        name: 'Red Chair',
        description: 'Comfortable red chair',
        price: 49.99,
        image: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=Red+Chair',
      },
      {
        name: 'Blue Table',
        description: 'Stylish blue table',
        price: 89.99,
        image: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Blue+Table',
      },
      {
        name: 'Green Lamp',
        description: 'Eco-friendly green lamp',
        price: 29.99,
        image: 'https://via.placeholder.com/150/00FF00/FFFFFF?text=Green+Lamp',
      },
    ],
  });

  console.log('Seeding finished!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());