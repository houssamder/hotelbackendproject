// fichier: createRoom.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const newRoom = await prisma.chambre.create({
    data: {
      numero: '101',
      etage: 1,
      capacite: 2,
      prixParNuit: 100.0,
      typeId: 1, // Assure-toi que ce typeId existe dans la table typeChambre
    },
  });

  console.log('Nouvelle chambre créée :', newRoom);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());

