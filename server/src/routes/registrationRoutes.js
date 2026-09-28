import express from 'express';
import {
  registerForEvent,
  getRegistrations,
  getRegistrationById,
  deleteRegistration,
} from '../controllers/registrationController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public: register for an event
router.post('/', registerForEvent);

// Admin protected: manage registrations
router.get('/', protectAdmin, getRegistrations);
router.get('/:id', protectAdmin, getRegistrationById);
router.delete('/:id', protectAdmin, deleteRegistration);

export default router;
