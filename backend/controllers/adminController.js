import User from '../models/User.js';
import Instructor from '../models/Instructor.js';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';
import Review from '../models/Review.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const [users, instructors, bookings, revenue, reviews] = await Promise.all([
      User.countDocuments(),
      Instructor.countDocuments({ isActive: true }),
      Booking.countDocuments(),
      Payment.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Review.countDocuments(),
    ]);

    const recentBookings = await Booking.find()
      .populate('user', 'name')
      .populate('instructor', 'name')
      .sort('-createdAt')
      .limit(10);

    const bookingsByStatus = await Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      stats: {
        users,
        instructors,
        bookings,
        revenue: revenue[0]?.total || 0,
        reviews,
        bookingsByStatus,
      },
      recentBookings,
    });
  } catch (error) {
    next(error);
  }
};
