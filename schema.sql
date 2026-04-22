-- Run this once against your Turso database to initialize the schema.
-- The app also runs CREATE TABLE IF NOT EXISTS automatically on first request.

CREATE TABLE IF NOT EXISTS habits (
  id          TEXT    PRIMARY KEY,
  name        TEXT    NOT NULL,
  emoji       TEXT    NOT NULL DEFAULT '⭐',
  type        TEXT    NOT NULL DEFAULT 'check', -- 'check' | 'count'
  unit        TEXT    NOT NULL DEFAULT '',
  position    INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS completions (
  habit_id  TEXT    NOT NULL,
  date      TEXT    NOT NULL, -- ISO date YYYY-MM-DD
  count     INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (habit_id, date),
  FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE
);
