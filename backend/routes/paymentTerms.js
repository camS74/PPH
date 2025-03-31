import express from 'express';
import pool from '../config/db.js'; // Ensure correct path to DB

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM payment_terms');
    res.json(result.rows); // Send data as JSON
  } catch (error) {
    console.error('Error fetching payment terms:', error);
    res.status(500).send('Server Error');
  }
});

export default router;
