import express from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../db.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate, requireRole('user'));

function parseSort({ sortBy, sortDir }, { allowed, defaultBy, defaultDir = 'asc' }) {
  const by = typeof sortBy === 'string' ? sortBy : '';
  const dirRaw = typeof sortDir === 'string' ? sortDir.toLowerCase() : '';
  const dir = dirRaw === 'desc' ? 'DESC' : dirRaw === 'asc' ? 'ASC' : defaultDir.toUpperCase();
  const expr = allowed[by] || allowed[defaultBy];
  return { expr, dir };
}

router.get('/stores', async (req, res) => {
  const { name = '', address = '' } = req.query;
  const { expr: sortExpr, dir: sortDir } = parseSort(req.query, {
    allowed: {
      name: 's.name',
      address: 's.address',
      overall_rating: 'overall_rating',
      user_rating: 'user_rating',
    },
    defaultBy: 'name',
    defaultDir: 'asc',
  });
  const result = await query(
    `SELECT s.id, s.name, s.address,
      COALESCE(ROUND(AVG(r.rating)::numeric, 2), 0) AS overall_rating,
      ur.rating AS user_rating
     FROM stores s
     LEFT JOIN ratings r ON r.store_id = s.id
     LEFT JOIN LATERAL (
       SELECT rating FROM ratings WHERE store_id = s.id AND user_id = $1 LIMIT 1
     ) ur ON true
     WHERE s.name ILIKE $2 AND s.address ILIKE $3
     GROUP BY s.id, ur.rating
     ORDER BY ${sortExpr} ${sortDir}`,
    [req.user.id, `%${name}%`, `%${address}%`]
  );
  res.json({ stores: result.rows });
});

router.post(
  '/stores/:storeId/rating',
  body('rating').isInt({ min: 1, max: 5 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { storeId } = req.params;
    const { rating } = req.body;

    const existing = await query(
      'SELECT id FROM ratings WHERE user_id = $1 AND store_id = $2',
      [req.user.id, storeId]
    );
    if (existing.rows.length) {
      return res.status(400).json({ message: 'Rating already exists. Use update instead.' });
    }

    const result = await query(
      'INSERT INTO ratings(user_id, store_id, rating) VALUES($1, $2, $3) RETURNING id, rating',
      [req.user.id, storeId, rating]
    );
    res.status(201).json({ rating: result.rows[0] });
  }
);

router.put(
  '/stores/:storeId/rating',
  body('rating').isInt({ min: 1, max: 5 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { storeId } = req.params;
    const { rating } = req.body;

    const result = await query(
      'UPDATE ratings SET rating = $1 WHERE user_id = $2 AND store_id = $3 RETURNING id, rating',
      [rating, req.user.id, storeId]
    );
    if (!result.rows.length) {
      return res.status(404).json({ message: 'Rating not found' });
    }
    res.json({ rating: result.rows[0] });
  }
);

export default router;
