import User from '../models/User.js';
import Instructor from '../models/Instructor.js';
import { generateToken } from '../middleware/auth.js';

const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      yogaPreferences: user.yogaPreferences,
    },
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, location, yogaPreferences } = req.body;
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const allowedRoles = ['user', 'instructor'];
    const userRole = allowedRoles.includes(role) ? role : 'user';

    const user = await User.create({
      name,
      email,
      password,
      role: userRole,
      location,
      yogaPreferences: yogaPreferences || [],
    });

    if (userRole === 'instructor') {
      const instructor = await Instructor.create({
        user: user._id,
        name: user.name,
        email: user.email,
        location: location || 'Remote',
        sessionPrice: 50,
        specializations: yogaPreferences || ['Hatha'],
        yogaTypes: yogaPreferences || ['Hatha'],
      });
      user.instructorProfile = instructor._id;
      await user.save();
    }

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('favorites')
      .populate('instructorProfile');
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};
