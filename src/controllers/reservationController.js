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



exports.createReservation= async (req, res) => {
  const { name, email, phone, type, startDate, endDate } = req.body;
  const start = new Date(startDate);
const end = new Date(endDate);

  try {
    
    const availableRoom = await prisma.room.findFirst({
      where: {
        type: type,
        bookings: {
          none: {
            
            OR: [
              {
                checkIn: {
                  lte: new Date(endDate),
                },
                checkOut: {
                  gte: new Date(startDate),
                }
              }
            ]
          }
        }
      }
    });

   if (!availableRoom) {
      return res.json({ available: false, message: 'Aucune chambre disponible pour cette période.' });
    }

    const booking = await prisma.booking.create({
      data: {
        name,
        Email: email,
        phone,
        room: { connect: { id: availableRoom.id } },
        checkIn: new Date(startDate),
        checkOut: new Date(endDate)
      }
    });

    res.status(201).json({ message: "Réservation réussie", booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la réservation" });
  }
};


exports.checkRoomAvailability = async (req, res) => {
  const { roomType, checkIn, checkOut } = req.body;

  if (!roomType || !checkIn || !checkOut) {
    return res.status(400).json({ error: 'roomType, checkIn et checkOut sont requis.' });
  }

  try {
    const availableRoom = await prisma.room.findFirst({
      where: {
        type: roomType,
        bookings: {
          none: {
            OR: [
              {
                checkIn: {
                  lte: new Date(checkOut),
                },
                checkOut: {
                  gte: new Date(checkIn),
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

    res.json({
      available: true,
      room: {
        id: availableRoom.id,
        number: availableRoom.number,
        type: availableRoom.type,
        price: availableRoom.price,
      },
    });
  } catch (error) {
    console.error('Erreur de disponibilité :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la vérification.' });
  }
};
