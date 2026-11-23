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
        name: 'Acharya Rahul Dev',
        email: 'rahul@harmony.com',
        location: 'Rishikesh, Uttarakhand',
        bio: 'Traditional Hatha & Ashtanga master trained at Rishikesh Yogpeeth with 16 years of authentic Himalayan teaching experience.',
        experience: 16,
        certifications: ['RYT-500', 'Yoga Siromani', 'Vedic Philosophy'],
        specializations: ['Hatha', 'Ashtanga', 'Pranayama'],
        yogaTypes: ['Hatha', 'Ashtanga'],
        sessionPrice: 45,
        rating: 4.96,
        reviewCount: 210,
        isFeatured: true,
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
      },
      {
        name: 'Pooja Sundaram',
        email: 'pooja@harmony.com',
        location: 'Bengaluru, Karnataka',
        bio: 'Senior Iyengar Yoga specialist focused on precise body alignment, posture correction, and holistic spine health.',
        experience: 12,
        certifications: ['Certified Iyengar Teacher', 'RYT-500'],
        specializations: ['Hatha', 'Restorative', 'Iyengar Alignment'],
        yogaTypes: ['Hatha', 'Restorative'],
        sessionPrice: 50,
        rating: 4.92,
        reviewCount: 164,
        isFeatured: true,
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
      },
      {
        name: 'Swami Aarav Sharma',
        email: 'aarav@harmony.com',
        location: 'Varanasi, Uttar Pradesh',
        bio: 'Spiritual practitioner and Kundalini guide from Varanasi, integrating sacred breathwork, mantra, and chakra meditation.',
        experience: 14,
        certifications: ['RYT-500', 'Kundalini Master', 'Kriya Yoga'],
        specializations: ['Kundalini', 'Pranayama', 'Chakra Healing'],
        yogaTypes: ['Kundalini'],
        sessionPrice: 60,
        rating: 4.88,
        reviewCount: 132,
        isFeatured: true,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      },
      {
        name: 'Dr. Meera Nambiar',
        email: 'meera@harmony.com',
        location: 'Kochi, Kerala',
        bio: 'Ayurvedic doctor and yoga therapist combining gentle restorative asanas, marma wellness, and deep healing relaxation.',
        experience: 11,
        certifications: ['BAMS (Ayurveda)', 'RYT-500', 'Therapeutic Yoga'],
        specializations: ['Restorative', 'Yin', 'Ayurvedic Wellness'],
        yogaTypes: ['Restorative', 'Yin'],
        sessionPrice: 55,
        rating: 4.95,
        reviewCount: 188,
        isFeatured: true,
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
      },
      {
        name: 'Vikramaditya Rathore',
        email: 'vikram@harmony.com',
        location: 'Mumbai, Maharashtra',
        bio: 'High-energy dynamic Power Yoga and Vinyasa coach for endurance, core stability, and athletic mobility.',
        experience: 8,
        certifications: ['RYT-200', 'Power Vinyasa Certified'],
        specializations: ['Power Yoga', 'Vinyasa', 'Athletic Conditioning'],
        yogaTypes: ['Power Yoga', 'Vinyasa'],
        sessionPrice: 40,
        rating: 4.79,
        reviewCount: 95,
        isFeatured: true,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      },
      {
        name: 'Priya Sharma',
        email: 'priya@harmony.com',
        location: 'Rishikesh, Uttarakhand',
        bio: 'Sound meditation and Himalayan Hatha yoga instructor helping students find stress relief, emotional balance, and clarity.',
        experience: 10,
        certifications: ['RYT-500', 'Sound Therapy Certified'],
        specializations: ['Hatha', 'Restorative', 'Sound Healing'],
        yogaTypes: ['Hatha', 'Restorative'],
        sessionPrice: 50,
        rating: 4.97,
        reviewCount: 220,
        isFeatured: true,
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      },
      {
        name: 'Ananya Deshmukh',
        email: 'ananya@harmony.com',
        location: 'Pune, Maharashtra',
        bio: 'Mindful movement teacher specializing in stress management, gentle flexibility, and desk-worker posture alignment.',
        experience: 7,
        certifications: ['RYT-200', 'Gentle Flow Specialist'],
        specializations: ['Hatha', 'Yin', 'Gentle Yoga'],
        yogaTypes: ['Hatha', 'Yin'],
        sessionPrice: 35,
        rating: 4.85,
        reviewCount: 110,
        isFeatured: false,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      },
      {
        name: 'Rohan Verma',
        email: 'rohan@harmony.com',
        location: 'New Delhi',
        bio: 'Vinyasa and mobility specialist connecting traditional yogic principles with modern urban lifestyles.',
        experience: 6,
        certifications: ['RYT-200', 'Mobility Coach'],
        specializations: ['Vinyasa', 'Power Yoga'],
        yogaTypes: ['Vinyasa', 'Power Yoga'],
        sessionPrice: 45,
        rating: 4.81,
        reviewCount: 78,
        isFeatured: false,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
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

      for (let d = 0; d <= 14; d++) {
        const date = new Date();
        date.setDate(date.getDate() + d);
        date.setUTCHours(0, 0, 0, 0);
        await Schedule.create({
          instructor: instructor._id,
          date,
          slots: generateSlots(),
          isAvailable: true,
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
