const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await prisma.reservation.findMany({
      include: { client: true, room: true }
    });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.createReservation = async (req, res) => {
  const { clientId, roomId, startDate, endDate } = req.body;
  try {
    const reservation = await prisma.reservation.create({
      data: {
        clientId: parseInt(clientId),
        roomId: parseInt(roomId),
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      }
    });
    res.status(201).json(reservation);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la réservation' });
  }
};
