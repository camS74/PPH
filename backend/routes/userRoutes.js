// routes/userRoutes.js
import express from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/db.js';
import authenticateToken from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Admin-only user creation
router.post('/create', authenticateToken, async (req, res) => {
  const { name, email, password, role } = req.body;

  // Only admin can create
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can create users.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at',
      [name, email, hashedPassword, role || 'subuser']
    );
    res.status(201).json({ message: 'User created successfully', user: result.rows[0] });
  } catch (error) {
    console.error('User creation error:', error);
    res.status(500).json({ message: 'User creation failed', error: error.message });
  }
});

export default router;
