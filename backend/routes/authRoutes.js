import express from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/db.js';
import { loginUser } from '../controllers/authController.js';

const router = express.Router();

// Register route (Admin only for now)
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, hashedPassword, role || 'subuser']
    );
    res.status(201).json({ message: 'User registered successfully', user: result.rows[0] });
  } catch (error) {
    console.error('Registration failed:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// ✅ Login route
router.post('/login', loginUser);

export default router;
