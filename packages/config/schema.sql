-- Design Hub Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  avatar VARCHAR(500),
  role VARCHAR(50) NOT NULL DEFAULT 'designer',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  color VARCHAR(7),
  owner_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  color VARCHAR(7),
  sla_hours INTEGER DEFAULT 48,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cards table
CREATE TABLE cards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'new',
  priority VARCHAR(20) NOT NULL DEFAULT 'medium',
  requester_name VARCHAR(255),
  requester_email VARCHAR(255),
  due_date TIMESTAMP WITH TIME ZONE,
  sla_started_at TIMESTAMP WITH TIME ZONE,
  sla_paused_at TIMESTAMP WITH TIME ZONE,
  sla_resumed_at TIMESTAMP WITH TIME ZONE,
  assignee_id UUID REFERENCES users(id),
  project_id UUID REFERENCES projects(id),
  category_id UUID REFERENCES categories(id),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tags table
CREATE TABLE tags (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  color VARCHAR(7),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Card Tags junction table
CREATE TABLE card_tags (
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (card_id, tag_id)
);

-- Comments table
CREATE TABLE comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  content TEXT NOT NULL,
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attachments table
CREATE TABLE attachments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  url VARCHAR(500) NOT NULL,
  mime_type VARCHAR(100),
  size BIGINT,
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
  uploaded_by_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  user_id UUID REFERENCES users(id),
  card_id UUID REFERENCES cards(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_cards_status ON cards(status);
CREATE INDEX idx_cards_assignee ON cards(assignee_id);
CREATE INDEX idx_cards_project ON cards(project_id);
CREATE INDEX idx_cards_category ON cards(category_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_comments_card ON comments(card_id);

-- Insert default categories
INSERT INTO categories (name, color, sla_hours) VALUES
  ('Branding', '#3B82F6', 48),
  ('UI/UX', '#10B981', 48),
  ('Marketing', '#F59E0B', 24),
  ('Print', '#8B5CF6', 72),
  ('Other', '#6B7280', 48);

-- Insert default tags
INSERT INTO tags (name, color) VALUES
  ('Urgent', '#EF4444'),
  ('Quick Win', '#10B981'),
  ('Review Needed', '#F59E0B'),
  ('Client Work', '#3B82F6');
