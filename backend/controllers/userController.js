import User from '../models/User.js';
import Instructor from '../models/Instructor.js';

export const updateProfile = async (req, res, next) => {
  try {
    const fields = ['name', 'phone', 'location', 'bio', 'avatar', 'yogaPreferences'];
    const updates = {};
    fields.forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const toggleFavorite = async (req, res, next) => {
  try {
    const { instructorId } = req.params;

    const instructor = await Instructor.findById(instructorId);
    if (!instructor) {
      return res.status(404).json({ success: false, message: 'Instructor not found' });
    }

    const user = await User.findById(req.user._id);
    const index = user.favorites.findIndex((f) => f.toString() === instructorId);

    if (index > -1) {
      user.favorites.splice(index, 1);
    } else {
      user.favorites.push(instructorId);
    }
    await user.save();
    await user.populate('favorites');

    res.json({ success: true, favorites: user.favorites });
  } catch (error) {
    next(error);
  }
};

export const getRecentlyViewed = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'recentlyViewed.instructor',
      model: 'Instructor',
    });
    res.json({ success: true, data: user.recentlyViewed || [] });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: req.body.isActive },
      { new: true }
    ).select('-password');
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
