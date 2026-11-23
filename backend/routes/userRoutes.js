import express from 'express';
import {
  updateProfile,
  toggleFavorite,
  getRecentlyViewed,
  getAllUsers,
  updateUserStatus,
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.put('/profile', protect, updateProfile);
router.post('/favorites/:instructorId', protect, toggleFavorite);
router.get('/recently-viewed', protect, getRecentlyViewed);

router.get('/', protect, authorize('admin'), getAllUsers);
router.put('/:id/status', protect, authorize('admin'), updateUserStatus);

export default router;
