import Booking from '../models/Booking.js';
import Event from '../models/Event.js';

// @desc    Create new booking (Dummy Payment)
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
  try {
    const { eventId, ticketCount, totalAmount } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.availableSeats < ticketCount) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    // Dummy payment is always successful here since it's activated directly
    const booking = new Booking({
      userId: req.user._id,
      eventId,
      ticketCount,
      totalAmount,
      paymentStatus: 'Completed',
      bookingStatus: 'Confirmed',
      bookingId: 'BK' + Date.now() + Math.floor(Math.random() * 1000)
    });

    const createdBooking = await booking.save();

    // Update available seats
    event.availableSeats -= ticketCount;
    await event.save();

    res.status(201).json(createdBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id }).populate('eventId');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('userId', 'name email').populate('eventId', 'title');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
