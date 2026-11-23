import { getYogaRecommendations } from '../services/aiService.js';
import Instructor from '../models/Instructor.js';
import User from '../models/User.js';
import { getPersonalizedInstructors } from '../services/aiService.js';

export const getRecommendations = async (req, res, next) => {
  try {
    const { goals, preferences } = req.body;
    const yogaTypes = getYogaRecommendations(preferences || [], goals || []);

    const instructors = await Instructor.find({
      isActive: true,
      yogaTypes: { $in: yogaTypes.map((t) => new RegExp(t, 'i')) },
    }).limit(10);

    res.json({
      success: true,
      recommendedYogaTypes: yogaTypes,
      instructors,
    });
  } catch (error) {
    next(error);
  }
};

export const getPersonalized = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const instructors = await Instructor.find({ isActive: true });
    const results = getPersonalizedInstructors(instructors, user);
    res.json({
      success: true,
      data: results.slice(0, 6).map((r) => ({
        ...r.instructor.toObject(),
        matchScore: r.matchScore,
        recommendedTypes: r.recommendedTypes,
      })),
    });
  } catch (error) {
    next(error);
  }
};
