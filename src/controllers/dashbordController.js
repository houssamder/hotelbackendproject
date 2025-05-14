const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getStatistics = async (req, res) => {
  try {
    const now = new Date();

    const totalClients = await prisma.client.count();

    const totalBookings = await prisma.booking.count();

    const totalRooms = await prisma.room.count();

    const currentBookings = await prisma.booking.count({
      where: {
        checkIn: { lte: now },
        checkOut: { gte: now },
      },
    });

    const roomsWithActiveBookings = await prisma.booking.findMany({
      where: {
        checkIn: { lte: now },
        checkOut: { gte: now },
      },
      select: { roomId: true },
    });

    const occupiedRoomIds = roomsWithActiveBookings.map(b => b.roomId);

    const availableRooms = await prisma.room.count({
      where: {
        id: { notIn: occupiedRoomIds },
      },
    });

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayStaffActivities = await prisma.staffActivity.count({
      where: {
        doneAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    res.json({
      totalClients,
      totalBookings,
      totalRooms,
      currentBookings,
      availableRooms,
      todayStaffActivities
    });
  } catch (error) {
    console.error('Erreur lors du calcul des statistiques :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des statistiques.' });
  }
};
