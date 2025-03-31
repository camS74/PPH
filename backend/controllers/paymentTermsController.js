import pool from '../db.js';

export const getTerms = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM payment_terms ORDER BY name ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching terms:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const addTerm = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Payment term is required' });

  try {
    const result = await pool.query(
      'INSERT INTO payment_terms (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Term already exists' });
    }
    console.error('Error adding term:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteTerm = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM payment_terms WHERE id = $1', [id]);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting term:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
