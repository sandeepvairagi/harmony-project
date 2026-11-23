import mongoose from 'mongoose';

const timeSlotSchema = new mongoose.Schema({
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  isBooked: { type: Boolean, default: false },
});

const scheduleSchema = new mongoose.Schema(
  {
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Instructor',
      required: true,
    },
    date: { type: Date, required: true },
    slots: [timeSlotSchema],
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

scheduleSchema.index({ instructor: 1, date: 1 }, { unique: true });

const Schedule = mongoose.model('Schedule', scheduleSchema);
export default Schedule;
