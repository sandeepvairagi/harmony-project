import Booking from '../models/Booking.js';
import Schedule from '../models/Schedule.js';
import Instructor from '../models/Instructor.js';
import User from '../models/User.js';
import Payment from '../models/Payment.js';
import { isValidObjectId } from '../utils/validateObjectId.js';
import { sendBookingConfirmation } from '../services/emailService.js';
import { sendBookingSMS } from '../services/smsService.js';
import { createNotification } from '../services/notificationService.js';

export const checkAvailability = async (req, res, next) => {
  try {
    const { instructorId, date } = req.query;

    if (!instructorId || !isValidObjectId(instructorId)) {
      return res.status(404).json({ success: false, message: 'Instructor not found' });
    }
    if (!date) {
      return res.status(400).json({ success: false, message: 'Date is required' });
    }

    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const minRange = new Date(startOfDay.getTime() - 14 * 60 * 60 * 1000);
    const maxRange = new Date(endOfDay.getTime() + 14 * 60 * 60 * 1000);

    const schedule = await Schedule.findOne({
      instructor: instructorId,
      date: { $gte: minRange, $lte: maxRange },
      isAvailable: true,
    });

    const bookedSlots = await Booking.find({
      instructor: instructorId,
      sessionDate: { $gte: minRange, $lte: maxRange },
      status: { $in: ['pending', 'confirmed'] },
    }).select('startTime endTime');

    const bookedTimes = bookedSlots.map((b) => b.startTime);

    const defaultSlots = [
      { startTime: '07:00', endTime: '08:00', isBooked: false },
      { startTime: '09:00', endTime: '10:00', isBooked: false },
      { startTime: '11:00', endTime: '12:00', isBooked: false },
      { startTime: '14:00', endTime: '15:00', isBooked: false },
      { startTime: '17:00', endTime: '18:00', isBooked: false },
      { startTime: '19:00', endTime: '20:00', isBooked: false },
    ];

    const sourceSlots =
      schedule?.slots && schedule.slots.length > 0 ? schedule.slots : defaultSlots;

    const availableSlots = sourceSlots.filter(
      (s) => !s.isBooked && !bookedTimes.includes(s.startTime)
    );

    res.json({
      success: true,
      date: startOfDay,
      slots: availableSlots,
      hasSchedule: !!schedule,
    });
  } catch (error) {
    next(error);
  }
};

export const createBooking = async (req, res, next) => {
  try {
    const { instructorId, sessionDate, startTime, endTime, yogaType, notes } = req.body;

    if (!instructorId || !isValidObjectId(instructorId)) {
      return res.status(404).json({ success: false, message: 'Instructor not found' });
    }

    const instructor = await Instructor.findById(instructorId);
    if (!instructor) {
      return res.status(404).json({ success: false, message: 'Instructor not found' });
    }

    const targetDate = new Date(sessionDate);
    const startOfDay = new Date(targetDate);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const minRange = new Date(startOfDay.getTime() - 14 * 60 * 60 * 1000);
    const maxRange = new Date(endOfDay.getTime() + 14 * 60 * 60 * 1000);

    const conflict = await Booking.findOne({
      instructor: instructorId,
      sessionDate: { $gte: minRange, $lte: maxRange },
      startTime,
      status: { $in: ['pending', 'confirmed'] },
    });

    if (conflict) {
      return res.status(400).json({ success: false, message: 'Time slot no longer available' });
    }

    let schedule = await Schedule.findOne({
      instructor: instructorId,
      date: { $gte: minRange, $lte: maxRange },
    });

    if (schedule) {
      const slot = schedule.slots.find((s) => s.startTime === startTime);
      if (slot) slot.isBooked = true;
      await schedule.save();
    }

    const meetingLink =
      instructor.meetingLink ||
      `https://zoom.us/j/${Math.random().toString(36).substring(2, 11)}`;

    const booking = await Booking.create({
      user: req.user._id,
      instructor: instructorId,
      schedule: schedule?._id,
      sessionDate: date,
      startTime,
      endTime,
      yogaType,
      notes,
      price: instructor.sessionPrice,
      status: 'confirmed',
      meetingLink,
    });

    const payment = await Payment.create({
      user: req.user._id,
      booking: booking._id,
      amount: instructor.sessionPrice,
      status: 'completed',
      transactionId: `txn_${Date.now()}`,
    });

    booking.payment = payment._id;
    await booking.save();

    const user = await User.findById(req.user._id);
    await sendBookingConfirmation(user, booking, instructor);
    if (user.phone) {
      await sendBookingSMS(
        user.phone,
        instructor.name,
        date.toLocaleDateString(),
        startTime
      );
    }

    await createNotification(req.user._id, {
      type: 'booking',
      title: 'Booking Confirmed',
      message: `Your session with ${instructor.name} on ${date.toLocaleDateString()} is confirmed.`,
      metadata: { bookingId: booking._id },
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('instructor', 'name avatar location sessionPrice meetingLink')
      .sort('-sessionDate');
    res.json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};

export const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('instructor')
      .populate('user', 'name email');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.status = 'cancelled';
    await booking.save();

    if (booking.schedule) {
      const schedule = await Schedule.findById(booking.schedule);
      const slot = schedule?.slots.find((s) => s.startTime === booking.startTime);
      if (slot) slot.isBooked = false;
      await schedule?.save();
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

export const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('instructor', 'name')
      .sort('-createdAt');
    res.json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};

export const updateBookingStatus = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};
