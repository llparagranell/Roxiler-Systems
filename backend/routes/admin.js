import express from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import { query } from '../db.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate, requireRole('admin'));

function parseSort({ sortBy, sortDir }, { allowed, defaultBy, defaultDir = 'asc' }) {
  const by = typeof sortBy === 'string' ? sortBy : '';
  const dirRaw = typeof sortDir === 'string' ? sortDir.toLowerCase() : '';
  const dir = dirRaw === 'desc' ? 'DESC' : dirRaw === 'asc' ? 'ASC' : defaultDir.toUpperCase();
  const expr = allowed[by] || allowed[defaultBy];
  return { expr, dir };
}

router.get('/dashboard', async (req, res) => {
  const totalUsers = await query('SELECT COUNT(*) FROM users');
  const totalStores = await query('SELECT COUNT(*) FROM stores');
  const totalRatings = await query('SELECT COUNT(*) FROM ratings');
  res.json({
    totalUsers: Number(totalUsers.rows[0].count),
    totalStores: Number(totalStores.rows[0].count),
    totalRatings: Number(totalRatings.rows[0].count),
  });
});

router.get('/users', async (req, res) => {
  const { name = '', email = '', address = '', role = '' } = req.query;
  const { expr: sortExpr, dir: sortDir } = parseSort(req.query, {
    allowed: {
      name: 'name',
      email: 'email',
      address: 'address',
      role: 'role',
    },
    defaultBy: 'name',
    defaultDir: 'asc',
  });
  const result = await query(
    `SELECT id, name, email, address, role, store_id FROM users
     WHERE name ILIKE $1 AND email ILIKE $2 AND address ILIKE $3 AND role ILIKE $4
     ORDER BY ${sortExpr} ${sortDir}`,
    [`%${name}%`, `%${email}%`, `%${address}%`, `%${role}%`]
  );
  res.json({ users: result.rows });
});

router.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  const result = await query(
    `SELECT u.id, u.name, u.email, u.address, u.role, u.store_id,
      s.name AS store_name,
      COALESCE(ROUND(AVG(r.rating)::numeric, 2), 0) AS store_rating
     FROM users u
     LEFT JOIN stores s ON s.id = u.store_id
     LEFT JOIN ratings r ON r.store_id = s.id
     WHERE u.id = $1
     GROUP BY u.id, s.id
     LIMIT 1`,
    [id]
  );
  if (!result.rows.length) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json({ user: result.rows[0] });
});

router.post(
  '/users',
  body('name').isLength({ min: 20, max: 60 }).withMessage('Name must be between 20 and 60 characters.'),
  body('email').isEmail().withMessage('Email must be valid.'),
  body('address').isLength({ max: 400 }).withMessage('Address must be at most 400 characters.'),
  body('password').matches(/^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/).withMessage('Password must be 8-16 characters and include one uppercase letter and one special character.'),
  body('role').isIn(['admin', 'user', 'owner']).withMessage('Role must be admin, user, or owner.'),
  body('store_id').optional({ nullable: true }).isInt({ min: 1 }).withMessage('store_id must be a positive integer.'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, address, password, role, store_id } = req.body;
    const exists = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (exists.rows.length) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    if (role === 'owner') {
      if (!store_id) {
        return res.status(400).json({ message: 'store_id is required for store owners' });
      }
      const storeExists = await query('SELECT id FROM stores WHERE id = $1', [store_id]);
      if (!storeExists.rows.length) {
        return res.status(400).json({ message: 'Store not found for store_id' });
      }
    }

    const hashed = await bcrypt.hash(password, 10);
    const result = await query(
      'INSERT INTO users(name, email, address, password_hash, role, store_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING id, name, email, address, role, store_id',
      [name, email, address, hashed, role, role === 'owner' ? store_id : null]
    );
    res.status(201).json({ user: result.rows[0] });
  }
);

router.get('/stores', async (req, res) => {
  const { name = '', email = '', address = '' } = req.query;
  const { expr: sortExpr, dir: sortDir } = parseSort(req.query, {
    allowed: {
      name: 's.name',
      email: 's.email',
      address: 's.address',
      rating: 'rating',
    },
    defaultBy: 'name',
    defaultDir: 'asc',
  });
  const result = await query(
    `SELECT s.id, s.name, s.email, s.address,
      COALESCE(ROUND(AVG(r.rating)::numeric, 2), 0) AS rating
     FROM stores s
     LEFT JOIN ratings r ON r.store_id = s.id
     WHERE s.name ILIKE $1 AND s.email ILIKE $2 AND s.address ILIKE $3
     GROUP BY s.id
     ORDER BY ${sortExpr} ${sortDir}`,
    [`%${name}%`, `%${email}%`, `%${address}%`]
  );
  res.json({ stores: result.rows });
});

router.post(
  '/stores',
  body('name').isLength({ min: 3, max: 80 }).withMessage('Store name must be between 3 and 80 characters.'),
  body('email').isEmail().withMessage('Email must be valid.'),
  body('address').isLength({ max: 400 }).withMessage('Address must be at most 400 characters.'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, address } = req.body;
    const result = await query(
      'INSERT INTO stores(name, email, address) VALUES($1, $2, $3) RETURNING id, name, email, address',
      [name, email, address]
    );
    res.status(201).json({ store: result.rows[0] });
  }
);

export default router;
