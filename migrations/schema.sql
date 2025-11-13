CREATE TABLE IF NOT EXISTS game_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS players (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS games (
  id INT AUTO_INCREMENT PRIMARY KEY,
  game_type_id INT NOT NULL,
  player1_id INT NOT NULL,
  player2_id INT NOT NULL,
  winner_id INT,
  FOREIGN KEY (game_type_id) REFERENCES game_types(id) ON DELETE CASCADE,
  FOREIGN KEY (player1_id) REFERENCES players(id) ON DELETE CASCADE,
  FOREIGN KEY (player2_id) REFERENCES players(id) ON DELETE CASCADE,
  FOREIGN KEY (winner_id) REFERENCES players(id) ON DELETE SET NULL
);

-- Optional seed types
INSERT IGNORE INTO game_types (id, name) VALUES
 (1, 'Pool'),
 (2, 'Table Tennis'),
 (3, 'Darts'),
 (4, 'Foosball');
