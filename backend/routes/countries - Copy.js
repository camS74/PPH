import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// GET all countries
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM countries ORDER BY name ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST a new country
router.post('/', async (req, res) => {
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Country name is required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO countries (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') { // Unique constraint violation
      return res.status(409).json({ error: 'Country already exists' });
    }
    console.error('Error adding country:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE a country by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query('DELETE FROM countries WHERE id = $1', [id]);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting country:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;