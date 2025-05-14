const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Liste des chambres
exports.getAllRooms = async (req, res) => {
  const rooms = await prisma.room.findMany();
  res.json(rooms);
};

// Créer une chambre
exports.createRoom = async (req, res) => {
  const { number, type, price ,descr} = req.body;
  const room = await prisma.room.create({
    data: { number, type, price: parseFloat(price) },
  });
  res.status(201).json(room);
};

// Modifier une chambre
exports.updateRoom = async (req, res) => {
  const { id } = req.params;
  const { number, type, price } = req.body;
  const room = await prisma.room.update({
    where: { id: parseInt(id) },
    data: { number, type, price: parseFloat(price) },
  });
  res.json(room);
};

// Supprimer une chambre
exports.deleteRoom = async (req, res) => {
  const { id } = req.params;
  await prisma.room.delete({ where: { id: parseInt(id) } });
  res.status(204).send();
};
