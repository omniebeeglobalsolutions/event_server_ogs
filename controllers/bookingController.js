import Booking from '../models/Booking.js';
import Event from '../models/Event.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay instance
const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  
  if (!key_id || key_id === 'YOUR_RAZORPAY_KEY_ID' || !key_secret || key_secret === 'YOUR_RAZORPAY_KEY_SECRET') {
    throw new Error('Razorpay API keys are not configured. Please set them in your server .env file.');
  }
  
  return new Razorpay({ key_id, key_secret });
};

// @desc    Create new booking (Razorpay Order Creation)
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

    const bookingId = 'BK' + Date.now() + Math.floor(Math.random() * 1000);

    let order;
    try {
      const razorpay = getRazorpayInstance();
      const options = {
        amount: Math.round(totalAmount * 100), // Amount in paise/cents
        currency: 'INR',
        receipt: bookingId,
      };
      order = await razorpay.orders.create(options);
    } catch (err) {
      return res.status(500).json({ message: `Razorpay Order Error: ${err.message}` });
    }

    const booking = new Booking({
      userId: req.user._id,
      eventId,
      ticketCount,
      totalAmount,
      paymentStatus: 'Pending',
      bookingStatus: 'Confirmed',
      bookingId,
      razorpayOrderId: order.id
    });

    const createdBooking = await booking.save();

    res.status(201).json({
      booking: createdBooking,
      order
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/bookings/verify
// @access  Private
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification parameters are missing' });
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_secret || key_secret === 'YOUR_RAZORPAY_KEY_SECRET') {
      return res.status(500).json({ message: 'Razorpay Secret Key is not configured on the server.' });
    }

    // Verify signature
    const shasum = crypto.createHmac('sha256', key_secret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest !== razorpay_signature) {
      return res.status(400).json({ message: 'Transaction signature is invalid. Payment verification failed.' });
    }

    // Find pending booking by order ID
    const booking = await Booking.findOne({ razorpayOrderId: razorpay_order_id });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found for this order' });
    }

    if (booking.paymentStatus === 'Completed') {
      return res.json({ message: 'Payment has already been verified', booking });
    }

    // Check available seats again before confirming
    const event = await Event.findById(booking.eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event associated with this booking not found' });
    }

    if (event.availableSeats < booking.ticketCount) {
      return res.status(400).json({ message: 'Seats are no longer available for this event.' });
    }

    // Confirm booking and update details
    booking.paymentStatus = 'Completed';
    booking.razorpayPaymentId = razorpay_payment_id;
    booking.razorpaySignature = razorpay_signature;
    const updatedBooking = await booking.save();

    // Decrement available seats
    event.availableSeats -= booking.ticketCount;
    await event.save();

    res.json({ message: 'Payment verified successfully', booking: updatedBooking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user bookings (Only completed payments)
// @route   GET /api/bookings/mybookings
// @access  Private
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ 
      userId: req.user._id,
      paymentStatus: 'Completed'
    }).populate('eventId');
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
