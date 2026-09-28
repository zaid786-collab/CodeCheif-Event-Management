import express from 'express';
import {
  loginAdmin,
  getAdminMe,
  getDashboardStats,
} from '../controllers/adminController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/me', protectAdmin, getAdminMe);
router.get('/stats', protectAdmin, getDashboardStats);

export default router;
