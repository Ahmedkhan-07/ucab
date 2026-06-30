const MyBooking = require('../models/MyBookingSchema');
const Car = require('../models/CarSchema');
const User = require('../models/UserSchema');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { carId, pickupLocation, dropLocation, bookingDate, bookingTime, distance } = req.body;

    if (!carId || !pickupLocation || !dropLocation || !bookingDate || !bookingTime || !distance) {
      return res.status(400).json({ message: 'All booking fields are required' });
    }

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    if (!car.available) {
      return res.status(400).json({ message: 'Car is currently unavailable' });
    }

    const calculatedPrice = Number(car.pricePerKm) * Number(distance);

    const booking = await MyBooking.create({
      user: req.user.id,
      car: carId,
      pickupLocation,
      dropLocation,
      bookingDate: new Date(bookingDate),
      bookingTime,
      distance: Number(distance),
      totalPrice: calculatedPrice,
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await MyBooking.find({ user: req.user.id })
      .populate('car')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
    const bookings = await MyBooking.find()
      .populate('user', 'name email phone')
      .populate('car')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update booking status
// @route   PATCH /api/bookings/:id/status
// @access  Private
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid booking status' });
    }

    const booking = await MyBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Authorization checks
    // Users can only cancel their own bookings
    if (req.user) {
      if (booking.user.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to change this booking status' });
      }
      if (status !== 'cancelled') {
        return res.status(400).json({ message: 'Users can only cancel their bookings' });
      }
    }

    // Admins can update to any status
    booking.status = status;
    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get admin statistics dashboard data
// @route   GET /api/bookings/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const totalBookings = await MyBooking.countDocuments();
    const totalCars = await Car.countDocuments();
    const totalUsers = await User.countDocuments();

    // Calculate total revenue from completed/confirmed bookings
    const earningsData = await MyBooking.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = earningsData.length > 0 ? earningsData[0].total : 0;

    res.json({
      totalBookings,
      totalCars,
      totalUsers,
      totalRevenue,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  getAdminStats,
};
