import Schedule from '../models/Schedule.js';

export const getInstructorSchedule = async (req, res, next) => {
  try {
    const { instructorId } = req.params;
    const from = req.query.from ? new Date(req.query.from) : new Date();
    const schedules = await Schedule.find({
      instructor: instructorId,
      date: { $gte: from },
      isAvailable: true,
    }).sort('date');
    res.json({ success: true, data: schedules });
  } catch (error) {
    next(error);
  }
};

export const createOrUpdateSchedule = async (req, res, next) => {
  try {
    const { instructor, date, slots } = req.body;
    const sessionDate = new Date(date);
    sessionDate.setHours(0, 0, 0, 0);

    const schedule = await Schedule.findOneAndUpdate(
      { instructor, date: sessionDate },
      { instructor, date: sessionDate, slots, isAvailable: true },
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ success: true, data: schedule });
  } catch (error) {
    next(error);
  }
};
