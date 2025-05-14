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
  const { name, email, phone, rometype, startDate, endDate } = req.body;
  console.log(name, email, phone, rometype, startDate, endDate);

  try {
    // First: find a room of the given type with no bookings
    let availableRoom = await prisma.room.findFirst({
      where: {
        type: rometype,
        bookings: {
          none: {} // No bookings at all
        }
      }
    });

    // If no unbooked room found, check for rooms with non-conflicting bookings
    if (!availableRoom) {
      availableRoom = await prisma.room.findFirst({
        where: {
          type: rometype,
          bookings: {
            every: {
              OR: [
                {
                  checkOut: {
                    lt: new Date(startDate)
                  }
                },
                {
                  checkIn: {
                    gt: new Date(endDate)
                  }
                }
              ]
            }
          }
        }
      });
    }

    if (!availableRoom) {
      return res.status(404).json({ message: 'No available rooms for the selected type and dates' });
    }

    // Create the booking
    const reservation = await prisma.booking.create({
      data: {
        name,
       Email: email,
        phone,
        checkIn: new Date(startDate),
        checkOut: new Date(endDate),
        room: {
          connect: {
            id: availableRoom.id
          }
        }
      }
    });

    return res.status(201).json({ message: 'Reservation successful', reservation });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while creating the reservation' });
  }
};


exports.createReservationlocale = async (req, res) => {
  const { name, number, startDate, endDate } = req.body;

  try {
    const availableRoom = await prisma.room.findFirst({
      where: { number: number },
    });

    if (!availableRoom) {
      return res.json({ available: false, message: 'Aucune chambre disponible avec ce numéro.' });
    }

    const booking = await prisma.booking.create({
      data: {
        name,
        room: { connect: { id: availableRoom.id } },
        checkIn: new Date(startDate),
        checkOut: new Date(endDate),
      },
    });

    res.status(201).json({ message: 'Réservation réussie', booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la réservation' });
  }
};

exports.checkRoomAvailability = async (req, res) => {
  try {
    const { checkIn, checkOut } = req.body;

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    const availableRoom = await prisma.room.findFirst({
        where: {
        bookings: {
          every: {
            OR: [
              {
                checkOut: {
                  lte: startDate,
                },
              },
              {
                checkIn: {
                  gte: endDate,
                },
              },
            ],
          },
        },
      },
    });

    if (!availableRoom) {
      return res.json({ available: false, message: 'Aucune chambre disponible pour cette période.' });
    }

     return res.json({ available: true, message: 'disonible BIENVENU .' });
  } catch (error) {
    console.error('Erreur de disponibilité :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la vérification.' });
  }
};
exports.deleteReservationByRoomNumber = async (req, res) => {
  const { number } = req.body;

  if (!number) {
    return res.status(400).json({ error: 'Le numéro de chambre est requis.' });
  }

  try {
    const room = await prisma.room.findFirst({
      where: { number: number },
    });

    if (!room) {
      return res.status(404).json({ error: 'Chambre non trouvée.' });
    }

    const booking = await prisma.booking.findFirst({
      where: { roomId: room.id },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Aucune réservation trouvée pour cette chambre.' });
    }

    await prisma.booking.delete({
      where: { id: booking.id },
    });

    res.json({ message: 'Réservation annulee avec succès.' });
  } catch (error) {
    console.error('Erreur suppression réservation :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la suppression.' });
  }
};

