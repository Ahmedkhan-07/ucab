const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  getAdminStats,
} = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

router.route('/')
  .post(protect, createBooking)
  .get(protect, adminOnly, getAllBookings);

router.get('/mybookings', protect, getMyBookings);
router.get('/stats', protect, adminOnly, getAdminStats);
router.patch('/:id/status', protect, updateBookingStatus);

module.exports = router;
