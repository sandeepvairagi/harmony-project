import Review from '../models/Review.js';
import Instructor from '../models/Instructor.js';

const updateInstructorRating = async (instructorId) => {
  const stats = await Review.aggregate([
    { $match: { instructor: instructorId } },
    {
      $group: {
        _id: '$instructor',
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 },
      },
    },
  ]);

  if (stats.length) {
    await Instructor.findByIdAndUpdate(instructorId, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].count,
    });
  }
};

export const createReview = async (req, res, next) => {
  try {
    const { instructorId, rating, comment, bookingId } = req.body;
    const review = await Review.create({
      user: req.user._id,
      instructor: instructorId,
      booking: bookingId,
      rating,
      comment,
    });
    await updateInstructorRating(instructorId);
    res.status(201).json({ success: true, data: review });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'You already reviewed this instructor' });
    }
    next(error);
  }
};

export const getInstructorReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ instructor: req.params.instructorId })
      .populate('user', 'name avatar')
      .sort('-createdAt');
    res.json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
};
