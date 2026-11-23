import express from 'express';
import {
  getInstructors,
  getInstructor,
  getFeaturedInstructors,
  getRecommendations,
  createInstructor,
  updateInstructor,
  deleteInstructor,
} from '../controllers/instructorController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/featured', getFeaturedInstructors);
router.get('/', getInstructors);
router.get('/recommendations/personalized', protect, getRecommendations);
router.get('/:id', getInstructor);

router.post('/', protect, authorize('admin'), createInstructor);
router.put('/:id', protect, authorize('admin', 'instructor'), updateInstructor);
router.delete('/:id', protect, authorize('admin'), deleteInstructor);

export default router;
