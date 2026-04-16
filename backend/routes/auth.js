import express from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import { query } from '../db.js';
import { authenticate, generateToken } from '../middleware/auth.js';

const router = express.Router();

const passwordRule = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

router.post(
  '/signup',
  body('name').isLength({ min: 20, max: 60 }).withMessage('Name must be between 20 and 60 characters.'),
  body('email').isEmail().withMessage('Email must be valid.'),
  body('address').isLength({ max: 400 }).withMessage('Address must be at most 400 characters.'),
  body('password').matches(passwordRule).withMessage('Password must be 8-16 characters and include one uppercase letter and one special character.'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, address, password } = req.body;
    const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const result = await query(
      'INSERT INTO users(name, email, address, password_hash, role) VALUES($1, $2, $3, $4, $5) RETURNING id, name, email, address, role',
      [name, email, address, hashed, 'user']
    );

    const token = generateToken(result.rows[0]);
    res.json({ user: result.rows[0], token });
  }
);

router.post('/login', body('email').isEmail().withMessage('Email must be valid.'), body('password').isString().withMessage('Password is required.'), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  const result = await query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(user);
  res.json({ user: { id: user.id, name: user.name, email: user.email, address: user.address, role: user.role, store_id: user.store_id }, token });
});

router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

router.put(
  '/password',
  authenticate,
  body('password').matches(passwordRule).withMessage('Password must be 8-16 characters and include one uppercase letter and one special character.'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const hashed = await bcrypt.hash(req.body.password, 10);
    await query('UPDATE users SET password_hash = $1 WHERE id = $2', [hashed, req.user.id]);
    res.json({ message: 'Password updated' });
  }
);

export default router;
