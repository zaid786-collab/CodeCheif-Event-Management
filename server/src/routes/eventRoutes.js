import express from 'express';
import {
  getEvents,
  getFeaturedEvent,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  toggleFeatured,
  getClubOverviewStats,
} from '../controllers/eventController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getEvents);
router.get('/featured', getFeaturedEvent);
router.get('/overview-stats', getClubOverviewStats);
router.get('/:idOrSlug', getEventById);

// Admin-protected routes
router.post('/', protectAdmin, createEvent);
router.put('/:id', protectAdmin, updateEvent);
router.delete('/:id', protectAdmin, deleteEvent);
router.patch('/:id/toggle-featured', protectAdmin, toggleFeatured);

export default router;
