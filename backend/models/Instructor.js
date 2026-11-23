import mongoose from 'mongoose';

const instructorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
    location: { type: String, required: true },
    experience: { type: Number, default: 0 },
    certifications: [{ type: String }],
    specializations: [{ type: String }],
    yogaTypes: [{ type: String }],
    sessionPrice: { type: Number, required: true, min: 0 },
    sessionDuration: { type: Number, default: 60 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    gallery: [{ type: String }],
    languages: [{ type: String }],
    meetingLink: { type: String, default: '' },
    meetingProvider: {
      type: String,
      enum: ['zoom', 'google_meet', 'none'],
      default: 'zoom',
    },
  },
  { timestamps: true }
);

instructorSchema.index({ location: 'text', name: 'text', specializations: 'text' });

const Instructor = mongoose.model('Instructor', instructorSchema);
export default Instructor;
