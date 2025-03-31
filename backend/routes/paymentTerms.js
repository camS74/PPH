import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM payment_terms ORDER BY name ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching payment terms:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Payment term name is required' });

  try {
    const result = await pool.query(
      'INSERT INTO payment_terms (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Payment term already exists' });
    }
    console.error('Error adding payment term:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM payment_terms WHERE id = $1', [id]);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting payment term:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
