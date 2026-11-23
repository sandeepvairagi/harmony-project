import express from 'express';
import { getDashboardStats } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, authorize('admin'));
router.get('/dashboard', getDashboardStats);

export default router;
