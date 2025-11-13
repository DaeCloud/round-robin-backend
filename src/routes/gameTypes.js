const express = require('express');
const { initPool } = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
  const pool = initPool();
  const [rows] = await pool.query('SELECT id, name FROM game_types ORDER BY id');
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  const pool = initPool();
  const [result] = await pool.query('INSERT INTO game_types (name) VALUES (?)', [name]);
  res.json({ id: result.insertId, name });
});

module.exports = router;
