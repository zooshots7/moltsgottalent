-- Content Ideas Database Schema

CREATE TABLE IF NOT EXISTS content_ideas (
  id TEXT PRIMARY KEY,           -- YYYY-MM-DD-NNN format
  date TEXT NOT NULL,
  type TEXT NOT NULL,            -- 'short' or 'long'
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT NOT NULL,
  tags TEXT,                     -- comma-separated
  status TEXT DEFAULT 'pitched', -- pitched/accepted/rejected/archived/duplicate
  response TEXT,                 -- your feedback
  embedding BLOB,                -- vector from Gemini
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster similarity searches
CREATE INDEX IF NOT EXISTS idx_status ON content_ideas(status);
CREATE INDEX IF NOT EXISTS idx_date ON content_ideas(date);
CREATE INDEX IF NOT EXISTS idx_slug ON content_ideas(slug);
