import express from 'express';
import pool from '../config/db'; // Ensure correct path to DB

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customer_sectors');
    res.json(result.rows); // Send data as JSON
  } catch (error) {
    console.error('Error fetching customer sectors:', error);
    res.status(500).send('Server Error');
  }
});

export default router;
