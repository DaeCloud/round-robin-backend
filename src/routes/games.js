const express = require('express');
const { initPool } = require('../db');
const router = express.Router();

// Generate round robin games for a game_type
router.post('/generate/:gameTypeId', async (req, res) => {
  const { gameTypeId } = req.params;
  const pool = initPool();

  // Get players (don’t sort; database order is irrelevant)
  const [players] = await pool.query('SELECT id FROM players');
  if (!players.length) return res.status(400).json({ error: 'no players' });

  // Fisher–Yates shuffle to randomize player order
  for (let i = players.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [players[i], players[j]] = [players[j], players[i]];
  }

  // Generate every possible pair (round-robin)
  const games = [];
  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      games.push([gameTypeId, players[i].id, players[j].id, null]);
    }
  }

  // Fisher–Yates shuffle to randomize player order
  for (let i = games.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [games[i], games[j]] = [games[j], games[i]];
  }

  if (!games.length) return res.json({ inserted: 0 });

  const [result] = await pool.query(
    'INSERT INTO games (game_type_id, player1_id, player2_id, winner_id) VALUES ?',
    [games]
  );

  res.json({ inserted: result.affectedRows });
});


// List games for a type (optionally ?active=1 for only unfinished)
router.get('/:gameTypeId', async (req, res) => {
  const { gameTypeId } = req.params;
  const active = req.query.active === '1';
  const pool = initPool();
  const q = `
    SELECT g.id, g.player1_id, p1.name as player1_name,
           g.player2_id, p2.name as player2_name,
           g.winner_id
    FROM games g
    JOIN players p1 ON p1.id = g.player1_id
    JOIN players p2 ON p2.id = g.player2_id
    WHERE g.game_type_id = ?
    ${active ? 'AND g.winner_id IS NULL' : ''}
    ORDER BY g.id
  `;
  const [rows] = await pool.query(q, [gameTypeId]);
  res.json(rows);
});

// Set winner
router.post('/:id/winner', async (req, res) => {
  const { id } = req.params;
  const { winner_id } = req.body;
  if (!winner_id) return res.status(400).json({ error: 'winner_id required' });
  const pool = initPool();

  const [check] = await pool.query('SELECT id FROM players WHERE id = ?', [winner_id]);
  if (!check.length) return res.status(400).json({ error: 'invalid winner_id' });

  await pool.query('UPDATE games SET winner_id = ? WHERE id = ?', [winner_id, id]);
  res.json({ ok: true });
});

module.exports = router;
