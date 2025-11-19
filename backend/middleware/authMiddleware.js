import jwt from 'jsonwebtoken';
import User from '../models/User.js';
const JWT_SECRET = process.env.JWT_SECRET;

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn('No token provided in request to', req.originalUrl);
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Attach user info (not full user object to avoid extra DB call always)
    req.user = decoded; // decoded contains id, role, name, email from sign
    next();
  } catch (err) {
    console.warn('Invalid token for request to', req.originalUrl, err && err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};
