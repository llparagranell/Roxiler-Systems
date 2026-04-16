import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { query } from '../db.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'nckdnvkdfnvndkfnv';

export async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization required' });
  }
  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const userResult = await query('SELECT id, name, email, address, role, store_id FROM users WHERE id = $1', [payload.userId]);
    if (!userResult.rows.length) {
      return res.status(401).json({ message: 'User not found' });
    }
    req.user = userResult.rows[0];
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
}

export function generateToken(user) {
  return jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: '8h',
  });
}
