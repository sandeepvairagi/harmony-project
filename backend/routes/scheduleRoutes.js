import express from 'express';
import { getInstructorSchedule, createOrUpdateSchedule } from '../controllers/scheduleController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/:instructorId', getInstructorSchedule);
router.post('/', protect, authorize('admin', 'instructor'), createOrUpdateSchedule);

export default router;
