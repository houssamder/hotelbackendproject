const express = require('express');
const app = express();
const cors = require('cors');
const roomRoutes = require('../src/routes/roomRoutes');
const clientRoutes = require('../src/routes/clientRoutes');
const reservationRoutes = require('../src/routes/reservationroutes');
const authRoutes = require ('../src/routes/authRoutes.js')
const statisticsRoutes = require('../src/routes/dashboardRoutes.js')
app.use(express.json());

app.use(cors());

app.use('/statistics', statisticsRoutes);
app.use('/auth', authRoutes);
app.use('/rooms', roomRoutes);
app.use('/clients', clientRoutes);
app.use('/reservations', reservationRoutes);

app.listen(3000, () => {
  console.log('Serveur démarré sur http://localhost:3000');
});
app.use('/auth', authRoutes);
