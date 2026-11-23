const YOGA_RECOMMENDATIONS = {
  stress: ['Hatha', 'Yin', 'Restorative'],
  flexibility: ['Vinyasa', 'Ashtanga', 'Power Yoga'],
  strength: ['Power Yoga', 'Ashtanga', 'Vinyasa'],
  beginner: ['Hatha', 'Gentle Yoga', 'Yin'],
  weight_loss: ['Power Yoga', 'Vinyasa', 'Hot Yoga'],
  meditation: ['Yin', 'Kundalini', 'Restorative'],
  back_pain: ['Gentle Yoga', 'Iyengar', 'Restorative'],
  energy: ['Vinyasa', 'Power Yoga', 'Kundalini'],
};

export const getYogaRecommendations = (preferences = [], goals = []) => {
  const recommended = new Set();

  goals.forEach((goal) => {
    const key = goal.toLowerCase().replace(/\s+/g, '_');
    (YOGA_RECOMMENDATIONS[key] || []).forEach((type) => recommended.add(type));
  });

  preferences.forEach((pref) => recommended.add(pref));

  if (recommended.size === 0) {
    return ['Hatha', 'Vinyasa', 'Yin', 'Restorative'];
  }

  return [...recommended];
};

export const scoreInstructorMatch = (instructor, userPrefs, recommendedTypes) => {
  let score = instructor.rating * 10;
  const specs = [...(instructor.specializations || []), ...(instructor.yogaTypes || [])];

  userPrefs.forEach((pref) => {
    if (specs.some((s) => s.toLowerCase().includes(pref.toLowerCase()))) score += 15;
  });

  recommendedTypes.forEach((type) => {
    if (specs.some((s) => s.toLowerCase().includes(type.toLowerCase()))) score += 20;
  });

  if (instructor.isFeatured) score += 5;
  return score;
};

export const getPersonalizedInstructors = (instructors, user) => {
  const prefs = user?.yogaPreferences || [];
  const recommendedTypes = getYogaRecommendations(prefs, prefs);

  return instructors
    .map((inst) => ({
      instructor: inst,
      matchScore: scoreInstructorMatch(inst, prefs, recommendedTypes),
      recommendedTypes,
    }))
    .sort((a, b) => b.matchScore - a.matchScore);
};
