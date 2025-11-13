const express = require('express');
const { initPool } = require('../db');
const router = express.Router();

router.get('/:gameTypeId', async (req, res) => {
  const { gameTypeId } = req.params;
  const pool = initPool();
  const q = `
    SELECT p.id, p.name, COUNT(g.winner_id) AS wins
    FROM players p
    LEFT JOIN games g ON g.winner_id = p.id AND g.game_type_id = ?
    GROUP BY p.id
    ORDER BY wins DESC, p.name ASC
  `;
  const [rows] = await pool.query(q, [gameTypeId]);
  res.json(rows);
});

module.exports = router;
