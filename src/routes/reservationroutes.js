const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

router.get('/', reservationController.getAllReservations);
router.post('/client', reservationController.createReservation);
router.post('/availability', reservationController.checkRoomAvailability);
router.post('/admin', reservationController.createReservationlocale);
router.delete('/byroom', reservationController.deleteReservationByRoomNumber);

module.exports = router;
