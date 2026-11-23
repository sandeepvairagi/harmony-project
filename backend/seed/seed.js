import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Instructor from '../models/Instructor.js';
import Schedule from '../models/Schedule.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';
import Notification from '../models/Notification.js';
import Payment from '../models/Payment.js';
import connectDB from '../config/db.js';

dotenv.config();

const yogaTypes = ['Hatha', 'Vinyasa', 'Yin', 'Ashtanga', 'Power Yoga', 'Restorative', 'Kundalini'];
const locations = ['New York, NY', 'Los Angeles, CA', 'Austin, TX', 'Seattle, WA', 'Miami, FL', 'Remote'];

const generateSlots = () => [
  { startTime: '07:00', endTime: '08:00', isBooked: false },
  { startTime: '09:00', endTime: '10:00', isBooked: false },
  { startTime: '11:00', endTime: '12:00', isBooked: false },
  { startTime: '14:00', endTime: '15:00', isBooked: false },
  { startTime: '17:00', endTime: '18:00', isBooked: false },
  { startTime: '19:00', endTime: '20:00', isBooked: false },
];

const seed = async () => {
  try {
    await connectDB();

    await Promise.all([
      User.deleteMany(),
      Instructor.deleteMany(),
      Schedule.deleteMany(),
      Booking.deleteMany(),
      Review.deleteMany(),
      Notification.deleteMany(),
      Payment.deleteMany(),
    ]);

    console.log('Cleared existing data');

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@harmony.com',
      password: 'admin123',
      role: 'admin',
      location: 'Remote',
    });

    const demoUser = await User.create({
      name: 'Sarah Johnson',
      email: 'user@harmony.com',
      password: 'user123',
      role: 'user',
      location: 'New York, NY',
      yogaPreferences: ['Vinyasa', 'Yin'],
      phone: '+15551234567',
    });

    const instructorsData = [
      {
        name: 'Maya Chen',
        email: 'maya@harmony.com',
        location: 'New York, NY',
        bio: 'Certified yoga therapist with 12 years guiding mindful movement and breathwork.',
        experience: 12,
        certifications: ['RYT-500', 'Yoga Therapy'],
        specializations: ['Vinyasa', 'Yin', 'Meditation'],
        yogaTypes: ['Vinyasa', 'Yin'],
        sessionPrice: 85,
        rating: 4.9,
        reviewCount: 124,
        isFeatured: true,
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
      },
      {
        name: 'James Rivera',
        email: 'james@harmony.com',
        location: 'Los Angeles, CA',
        bio: 'Power yoga specialist helping students build strength and flexibility.',
        experience: 8,
        certifications: ['RYT-200', 'ACE Fitness'],
        specializations: ['Power Yoga', 'Ashtanga'],
        yogaTypes: ['Power Yoga', 'Ashtanga'],
        sessionPrice: 75,
        rating: 4.8,
        reviewCount: 89,
        isFeatured: true,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      },
      {
        name: 'Priya Sharma',
        email: 'priya@harmony.com',
        location: 'Austin, TX',
        bio: 'Gentle yoga and restorative practices for stress relief and healing.',
        experience: 10,
        certifications: ['RYT-500', 'Restorative Yoga'],
        specializations: ['Hatha', 'Restorative', 'Gentle Yoga'],
        yogaTypes: ['Hatha', 'Restorative'],
        sessionPrice: 65,
        rating: 4.95,
        reviewCount: 156,
        isFeatured: true,
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      },
      {
        name: 'Elena Kozlov',
        email: 'elena@harmony.com',
        location: 'Seattle, WA',
        bio: 'Kundalini and breathwork instructor for energy and spiritual alignment.',
        experience: 15,
        certifications: ['RYT-500', 'Kundalini Research Institute'],
        specializations: ['Kundalini', 'Breathwork'],
        yogaTypes: ['Kundalini'],
        sessionPrice: 95,
        rating: 4.7,
        reviewCount: 67,
        isFeatured: false,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      },
      {
        name: 'Marcus Williams',
        email: 'marcus@harmony.com',
        location: 'Miami, FL',
        bio: 'Beach yoga and athletic vinyasa flows for all fitness levels.',
        experience: 6,
        certifications: ['RYT-200'],
        specializations: ['Vinyasa', 'Beach Yoga'],
        yogaTypes: ['Vinyasa', 'Power Yoga'],
        sessionPrice: 70,
        rating: 4.6,
        reviewCount: 45,
        isFeatured: true,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      },
      {
        name: 'Anika Patel',
        email: 'anika@harmony.com',
        location: 'Remote',
        bio: 'Online yoga coach specializing in beginners and desk-worker wellness.',
        experience: 5,
        certifications: ['RYT-200'],
        specializations: ['Hatha', 'Gentle Yoga'],
        yogaTypes: ['Hatha', 'Yin'],
        sessionPrice: 55,
        rating: 4.85,
        reviewCount: 98,
        isFeatured: true,
        meetingProvider: 'zoom',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      },
    ];

    const instructors = [];
    for (const data of instructorsData) {
      const user = await User.create({
        name: data.name,
        email: data.email,
        password: 'instructor123',
        role: 'instructor',
        location: data.location,
        avatar: data.avatar,
        yogaPreferences: data.yogaTypes,
      });

      const instructor = await Instructor.create({
        ...data,
        user: user._id,
        meetingLink: `https://zoom.us/j/harmony-${data.name.split(' ')[0].toLowerCase()}`,
      });

      user.instructorProfile = instructor._id;
      await user.save();
      instructors.push(instructor);

      for (let d = 1; d <= 14; d++) {
        const date = new Date();
        date.setDate(date.getDate() + d);
        date.setHours(0, 0, 0, 0);
        await Schedule.create({
          instructor: instructor._id,
          date,
          slots: generateSlots(),
        });
      }
    }

    demoUser.favorites = [instructors[0]._id, instructors[2]._id];
    await demoUser.save();

    const sessionDate = new Date();
    sessionDate.setDate(sessionDate.getDate() + 3);
    sessionDate.setHours(0, 0, 0, 0);

    const booking = await Booking.create({
      user: demoUser._id,
      instructor: instructors[0]._id,
      sessionDate,
      startTime: '09:00',
      endTime: '10:00',
      yogaType: 'Vinyasa',
      price: instructors[0].sessionPrice,
      status: 'confirmed',
      meetingLink: instructors[0].meetingLink,
    });

    await Payment.create({
      user: demoUser._id,
      booking: booking._id,
      amount: booking.price,
      status: 'completed',
      transactionId: 'seed_txn_001',
    });

    await Review.create({
      user: demoUser._id,
      instructor: instructors[0]._id,
      booking: booking._id,
      rating: 5,
      comment: 'Maya is an incredible instructor. Calm, precise, and deeply knowledgeable.',
    });

    await Notification.create({
      user: demoUser._id,
      type: 'booking',
      title: 'Welcome to Harmony Bookings',
      message: 'Your account is ready. Explore instructors and book your first session!',
    });

    console.log('Seed completed successfully');
    console.log('--- Login Credentials ---');
    console.log('Admin: admin@harmony.com / admin123');
    console.log('User:  user@harmony.com / user123');
    console.log('Instructor: maya@harmony.com / instructor123');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
