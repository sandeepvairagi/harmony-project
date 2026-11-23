import express from 'express';
import Payment from '../models/Payment.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/my', protect, async (req, res, next) => {
  try {
    const payments = await Payment.find({ user: req.user._id }).populate('booking');
    res.json({ success: true, data: payments });
  } catch (error) {
    next(error);
  }
});

router.get('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    const payments = await Payment.find().populate('user', 'name email').sort('-createdAt');
    res.json({ success: true, data: payments });
  } catch (error) {
    next(error);
  }
});

export default router;
