import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';

export const protectAdmin = async (req, res, next) => {
  let token;

  const isProduction = process.env.NODE_ENV === 'production';
  const secret = process.env.JWT_SECRET;

  if (isProduction && !secret) {
    console.error('FATAL SECURITY ERROR: JWT_SECRET environment variable is missing in production.');
    return res.status(500).json({
      success: false,
      message: 'Server security configuration error. Please contact administrator.',
    });
  }

  const activeSecret = secret || 'supersecret_codechef_campus_club_jwt_key_2026_dev';

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Access denied. Malformed authorization header.',
        });
      }

      const decoded = jwt.verify(token, activeSecret);

      const admin = await Admin.findById(decoded.id).select('-password');
      if (!admin) {
        return res.status(401).json({
          success: false,
          message: 'Admin authorization failed: user no longer exists.',
        });
      }

      req.admin = admin;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session token. Please log in again.',
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authorization token provided.',
    });
  }
};
