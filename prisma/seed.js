const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Database:', process.env.DATABASE_URL);
  const rooms = await prisma.room.createMany({
    data: [
      { number: '101', type: 'simple', price: 50.0, description: 'Simple room' },
      { number: '102', type: 'double', price: 75.0, description: 'Double room' },
      { number: '103', type: 'suite', price: 120.0, description: 'Luxury suite' },
    ],
  });

  console.log('✅ Rooms created');
}

main()
  .catch((e) => {
    console.error('❌ Error while seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
