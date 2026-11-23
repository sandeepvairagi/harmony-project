import Instructor from '../models/Instructor.js';
import User from '../models/User.js';
import Review from '../models/Review.js';
import { APIFeatures } from '../utils/apiFeatures.js';
import { getPersonalizedInstructors } from '../services/aiService.js';
import { isValidObjectId } from '../utils/validateObjectId.js';

export const getInstructors = async (req, res, next) => {
  try {
    let query = Instructor.find({ isActive: true });
    const features = new APIFeatures(query, req.query)
      .search(['name', 'location', 'specializations', 'yogaTypes'])
      .filter();

    if (req.query.yogaType) {
      features.query = features.query.find({
        yogaTypes: { $regex: req.query.yogaType, $options: 'i' },
      });
    }
    if (req.query.location) {
      features.query = features.query.find({
        location: { $regex: req.query.location, $options: 'i' },
      });
    }
    if (req.query.minPrice || req.query.maxPrice) {
      const priceFilter = {};
      if (req.query.minPrice) priceFilter.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) priceFilter.$lte = Number(req.query.maxPrice);
      features.query = features.query.find({ sessionPrice: priceFilter });
    }
    if (req.query.featured === 'true') {
      features.query = features.query.find({ isFeatured: true });
    }

    features.sort().limitFields().paginate();
    const instructors = await features.query;
    const total = await Instructor.countDocuments({ isActive: true });

    res.json({
      success: true,
      count: instructors.length,
      total,
      page: features.page,
      pages: Math.ceil(total / features.limit),
      data: instructors,
    });
  } catch (error) {
    next(error);
  }
};

export const getInstructor = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(404).json({ success: false, message: 'Instructor not found' });
    }

    const instructor = await Instructor.findById(req.params.id);
    if (!instructor) {
      return res.status(404).json({ success: false, message: 'Instructor not found' });
    }

    if (req.user) {
      const user = await User.findById(req.user._id);
      const existing = user.recentlyViewed?.find(
        (r) => r.instructor?.toString() === instructor._id.toString()
      );
      if (existing) {
        existing.viewedAt = new Date();
      } else {
        user.recentlyViewed = user.recentlyViewed || [];
        user.recentlyViewed.unshift({ instructor: instructor._id, viewedAt: new Date() });
        user.recentlyViewed = user.recentlyViewed.slice(0, 10);
      }
      await user.save();
    }

    const reviews = await Review.find({ instructor: instructor._id })
      .populate('user', 'name avatar')
      .sort('-createdAt')
      .limit(20);

    res.json({ success: true, data: instructor, reviews });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedInstructors = async (req, res, next) => {
  try {
    const instructors = await Instructor.find({ isFeatured: true, isActive: true })
      .sort('-rating')
      .limit(6);
    res.json({ success: true, data: instructors });
  } catch (error) {
    next(error);
  }
};

export const getRecommendations = async (req, res, next) => {
  try {
    const instructors = await Instructor.find({ isActive: true });
    const user = await User.findById(req.user._id);
    const personalized = getPersonalizedInstructors(instructors, user);
    res.json({
      success: true,
      data: personalized.slice(0, 8).map((p) => ({
        ...p.instructor.toObject(),
        matchScore: p.matchScore,
      })),
    });
  } catch (error) {
    next(error);
  }
};

export const createInstructor = async (req, res, next) => {
  try {
    const instructor = await Instructor.create(req.body);
    res.status(201).json({ success: true, data: instructor });
  } catch (error) {
    next(error);
  }
};

export const updateInstructor = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(404).json({ success: false, message: 'Instructor not found' });
    }

    const instructor = await Instructor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!instructor) {
      return res.status(404).json({ success: false, message: 'Instructor not found' });
    }
    res.json({ success: true, data: instructor });
  } catch (error) {
    next(error);
  }
};

export const deleteInstructor = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(404).json({ success: false, message: 'Instructor not found' });
    }

    const instructor = await Instructor.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!instructor) {
      return res.status(404).json({ success: false, message: 'Instructor not found' });
    }
    res.json({ success: true, message: 'Instructor deactivated' });
  } catch (error) {
    next(error);
  }
};
