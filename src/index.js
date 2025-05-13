const express = require('express');
const app = express();

const roomRoutes = require('../routes/roomRoutes');
const clientRoutes = require('../routes/clientRoutes');
const reservationRoutes = require('../routes/reservationRoutes');

app.use(express.json());

app.use('/rooms', roomRoutes);
app.use('/clients', clientRoutes);
app.use('/reservations', reservationRoutes);

app.listen(3000, () => {
  console.log('Serveur démarré sur http://localhost:3000');
});
const authRoutes = require('../routes/authRoutes');
app.use('/auth', authRoutes);
