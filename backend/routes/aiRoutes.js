import express from 'express';
import { getRecommendations, getPersonalized } from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/recommend', getRecommendations);
router.get('/personalized', protect, getPersonalized);

export default router;
