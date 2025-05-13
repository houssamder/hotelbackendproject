// fichier: listClients.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const clients = await prisma.client.findMany({
    include: {
      reservations: true, // Inclut les réservations s’il y en a
    },
  });

  console.log('Liste des clients :');
  console.table(clients);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
