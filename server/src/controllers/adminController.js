import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';
import { Event } from '../models/Event.js';
import { Registration } from '../models/Registration.js';

// Helper to generate JWT
const generateToken = (id) => {
  const secret = process.env.JWT_SECRET;
  if (process.env.NODE_ENV === 'production' && !secret) {
    throw new Error('JWT_SECRET environment variable is missing in production.');
  }
  return jwt.sign(
    { id },
    secret || 'supersecret_codechef_campus_club_jwt_key_2026_dev',
    {
      expiresIn: '7d',
    }
  );
};

// @desc    Admin Login & Token Generation
// @route   POST /api/admin/login
// @access  Public
export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your email and password.',
      });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your email and password.',
      });
    }

    const token = generateToken(admin._id);

    res.status(200).json({
      success: true,
      message: 'Admin authentication successful',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Current Logged-in Admin Profile
// @route   GET /api/admin/me
// @access  Private (Admin)
export const getAdminMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      admin: {
        id: req.admin._id,
        name: req.admin.name,
        email: req.admin.email,
        role: req.admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Admin Dashboard Analytics & Overview Stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
export const getDashboardStats = async (req, res, next) => {
  try {
    const now = new Date();

    const [totalEvents, upcomingEvents, totalRegistrations, featuredEvent, recentRegistrations, categoryBreakdown, yearBreakdown] =
      await Promise.all([
        Event.countDocuments(),
        Event.countDocuments({ date: { $gte: now } }),
        Registration.countDocuments({ status: { $ne: 'Cancelled' } }),
        Event.findOne({ featured: true }).lean(),
        Registration.find()
          .populate('eventId', 'title category code')
          .sort({ registeredAt: -1 })
          .limit(6)
          .lean(),
        Event.aggregate([
          { $group: { _id: '$category', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),
        Registration.aggregate([
          { $group: { _id: '$year', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),
      ]);

    // Attach registration count to featured event if exists
    let featuredEventWithStats = null;
    if (featuredEvent) {
      const regCount = await Registration.countDocuments({
        eventId: featuredEvent._id,
        status: { $ne: 'Cancelled' },
      });
      featuredEventWithStats = {
        ...featuredEvent,
        currentRegistrations: regCount,
        seatsLeft: Math.max(0, (featuredEvent.maxParticipants || 100) - regCount),
      };
    }

    res.status(200).json({
      success: true,
      data: {
        metrics: {
          totalEvents,
          upcomingEvents,
          totalRegistrations,
          featuredEventTitle: featuredEvent ? featuredEvent.title : 'None',
        },
        featuredEvent: featuredEventWithStats,
        recentRegistrations,
        categoryBreakdown,
        yearBreakdown,
      },
    });
  } catch (error) {
    next(error);
  }
};
