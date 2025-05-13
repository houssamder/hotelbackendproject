// Importation de Prisma Client
const { PrismaClient } = require('@prisma/client');

// Création d'une instance de PrismaClient
const prisma = new PrismaClient();

async function main() {
  // Exemple de requête
  const utilisateurs = await prisma.utilisateur.findMany();
  console.log(utilisateurs);
}

main()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
