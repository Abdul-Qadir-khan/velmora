// prisma/seed.js - ✅ FIXED FOREIGN KEYS
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Clear everything
  await prisma.cartItem.deleteMany({});
  await prisma.variation.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.brand.deleteMany({});
  await prisma.category.deleteMany({});

  // 2. Create Categories
  const tshirts = await prisma.category.upsert({
    where: { slug: 't-shirts' },
    update: {},
    create: { name: 'T-shirts', slug: 't-shirts' }
  });

  const jeans = await prisma.category.upsert({
    where: { slug: 'jeans' },
    update: {},
    create: { name: 'Jeans', slug: 'jeans' }
  });

  const hoodies = await prisma.category.upsert({
    where: { slug: 'hoodies' },
    update: {},
    create: { name: 'Hoodies', slug: 'hoodies' }
  });

  // 3. Create Brands
  const lycoon = await prisma.brand.upsert({
    where: { name: 'Lycoon Wear' },
    update: {},
    create: { name: 'Lycoon Wear' }
  });

  const denim = await prisma.brand.upsert({
    where: { name: 'DenimPro' },
    update: {},
    create: { name: 'DenimPro' }
  });

  const urban = await prisma.brand.upsert({
    where: { name: 'UrbanWear' },
    update: {},
    create: { name: 'UrbanWear' }
  });

  // 4. Create Products WITH REAL IDs
  await prisma.product.create({
    data: {
      name: 'Classic White T-Shirt',
      slug: 'classic-white-tshirt',
      description: '100% cotton, comfortable fit',
      price: 1999,
      originalPrice: 2599,
      category: 'T-shirts',
      categoryId: tshirts.id,
      brandId: lycoon.id,
      stock: 50,
      rating: 4.5,
      isNew: true,
      bestSeller: true,
      images: JSON.stringify([
        'https://via.placeholder.com/400x500/ffffff/000000?text=TSHIRT'
      ]),
      seoTitle: 'Classic White T-Shirt | Lycoon Wear'
    }
  });

  await prisma.product.create({
    data: {
      name: 'Blue Slim Jeans',
      slug: 'blue-slim-jeans',
      description: 'Comfortable slim-fit denim',
      price: 4999,
      originalPrice: 5999,
      category: 'Jeans',
      categoryId: jeans.id,
      brandId: denim.id,
      stock: 30,
      rating: 4.2,
      bestSeller: true,
      images: JSON.stringify([
        'https://via.placeholder.com/400x500/0000ff/ffffff?text=JEANS'
      ]),
      seoTitle: 'Blue Slim Jeans | DenimPro'
    }
  });

  await prisma.product.create({
    data: {
      name: 'Red Hoodie',
      slug: 'red-hoodie',
      description: 'Cozy hoodie with kangaroo pocket',
      price: 3999,
      originalPrice: 4999,
      category: 'Hoodies',
      categoryId: hoodies.id,
      brandId: urban.id,
      stock: 20,
      rating: 4.7,
      isNew: true,
      images: JSON.stringify([
        'https://via.placeholder.com/400x500/ff0000/ffffff?text=HOODIE'
      ]),
      seoTitle: 'Red Hoodie | UrbanWear'
    }
  });

  console.log('✅ Seed complete! 3 Products + Categories + Brands');
}

main()
  .catch(e => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });