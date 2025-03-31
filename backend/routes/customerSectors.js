import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// GET all sectors
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customer_sectors ORDER BY name ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching customer sectors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST a new sector
router.post('/', async (req, res) => {
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Sector name is required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO customer_sectors (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') { // Unique constraint violation
      return res.status(409).json({ error: 'Sector already exists' });
    }
    console.error('Error adding sector:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE a sector by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    await pool.query('DELETE FROM customer_sectors WHERE id = $1', [id]);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting sector:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;