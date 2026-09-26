-- Inkhel Tech D1 Database Schema

CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  author_name TEXT DEFAULT 'Lalsangzuala',
  author_role TEXT DEFAULT 'Tech Lead & Gadget Reviewer',
  author_avatar TEXT,
  cover_image TEXT,
  read_time TEXT DEFAULT '5 min read',
  tags TEXT DEFAULT '[]',
  quick_specs TEXT DEFAULT '[]',
  pros_cons TEXT DEFAULT '{}',
  affiliate_deal TEXT DEFAULT '{}',
  published INTEGER DEFAULT 1,
  is_featured INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
