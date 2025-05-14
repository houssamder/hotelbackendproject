const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs'); // ✅ You forgot this
const prisma = new PrismaClient();

async function main() {
  console.log('Database:', process.env.DATABASE_URL);
    console.log('Resetting and seeding the database...');

  
  await prisma.booking.deleteMany();
  await prisma.room.deleteMany();

  const adminUsers = [
    {
      name: 'salah',
      email: 'salah@gmail.com',
      password: '123',
      phone: '1111111111',
    },
    {
      name: 'islem',
      email: 'islem@gmail.com',
      password: '1234',
      phone: '2222222222',
    }
  ];

  for (const user of adminUsers) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const admin = await prisma.client.upsert({
      where: { email: user.email },
      update: {},
      create: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
        isadmin: true,
        phone: user.phone,
      },
    });

    console.log(`✅ Created admin: ${admin.email}`);
  }

  await prisma.room.createMany({
    data: [
      { number: '101', type: 'simple', price: 50.0, description: 'Simple room' },
      { number: '102', type: 'double', price: 75.0, description: 'Double room' },
      { number: '103', type: 'suite', price: 120.0, description: 'Luxury suite' },
      { number: '104', type: 'suite', price: 140.0, description: 'Luxury suite' },
      { number: '105', type: 'suite', price: 120.0, description: 'Luxury suite' },
     
    ],
    skipDuplicates: true, // optional: avoids duplicate insert errors
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