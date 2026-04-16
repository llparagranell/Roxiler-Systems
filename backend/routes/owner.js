import express from 'express';
import { query } from '../db.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate, requireRole('owner'));

function parseSort({ sortBy, sortDir }, { allowed, defaultBy, defaultDir = 'desc' }) {
  const by = typeof sortBy === 'string' ? sortBy : '';
  const dirRaw = typeof sortDir === 'string' ? sortDir.toLowerCase() : '';
  const dir = dirRaw === 'asc' ? 'ASC' : dirRaw === 'desc' ? 'DESC' : defaultDir.toUpperCase();
  const expr = allowed[by] || allowed[defaultBy];
  return { expr, dir };
}

router.get('/dashboard', async (req, res) => {
  if (!req.user.store_id) {
    return res.status(400).json({ message: 'No store assigned to owner' });
  }

  const { expr: sortExpr, dir: sortDir } = parseSort(req.query, {
    allowed: {
      name: 'u.name',
      email: 'u.email',
      address: 'u.address',
      rating: 'r.rating',
      created_at: 'r.created_at',
    },
    defaultBy: 'created_at',
    defaultDir: 'desc',
  });

  const ratingsResult = await query(
    `SELECT u.id, u.name, u.email, u.address, r.rating, r.created_at
     FROM ratings r
     JOIN users u ON u.id = r.user_id
     WHERE r.store_id = $1
     ORDER BY ${sortExpr} ${sortDir}`,
    [req.user.store_id]
  );

  const average = await query(
    'SELECT COALESCE(ROUND(AVG(rating)::numeric, 2), 0) AS avg_rating FROM ratings WHERE store_id = $1',
    [req.user.store_id]
  );

  res.json({
    averageRating: Number(average.rows[0].avg_rating),
    ratings: ratingsResult.rows,
  });
});

export default router;
