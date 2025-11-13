const express = require('express');
const cors = require('cors');
const { initPool } = require('./db');
const dotenv = require('dotenv');

dotenv.config();

const gameTypesRouter = require('./routes/gameTypes');
const playersRouter = require('./routes/players');
const gamesRouter = require('./routes/games');
const leaderboardRouter = require('./routes/leaderboard');

const app = express();

app.use(cors());
app.use(express.json());

initPool(); // Ensure env is used (pool created lazily in routes but ok)

app.use('/game-types', gameTypesRouter);
app.use('/players', playersRouter);
app.use('/games', gamesRouter);
app.use('/leaderboard', leaderboardRouter);

app.get('/', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
