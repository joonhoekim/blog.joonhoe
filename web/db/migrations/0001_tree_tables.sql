-- Create tree_nodes table
CREATE TABLE IF NOT EXISTS tree_nodes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  path TEXT NOT NULL,
  content TEXT,
  parent_id INTEGER,
  workspace_id INTEGER NOT NULL,
  is_open BOOLEAN DEFAULT FALSE,
  is_selected BOOLEAN DEFAULT FALSE,
  metadata JSONB,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by INTEGER NOT NULL,
  updated_by INTEGER NOT NULL
);

-- Create tree_favorites table
CREATE TABLE IF NOT EXISTS tree_favorites (
  id SERIAL PRIMARY KEY,
  node_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(node_id, user_id)
);

-- Create tree_recent table
CREATE TABLE IF NOT EXISTS tree_recent (
  id SERIAL PRIMARY KEY,
  node_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  accessed_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(node_id, user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tree_nodes_parent_id ON tree_nodes(parent_id);
CREATE INDEX IF NOT EXISTS idx_tree_nodes_workspace_id ON tree_nodes(workspace_id);
CREATE INDEX IF NOT EXISTS idx_tree_favorites_user_id ON tree_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_tree_recent_user_id ON tree_recent(user_id);
CREATE INDEX IF NOT EXISTS idx_tree_recent_accessed_at ON tree_recent(accessed_at);

-- Add sample data for testing
INSERT INTO tree_nodes (name, type, path, content, parent_id, workspace_id, is_open, created_by, updated_by)
VALUES
  ('web', 'folder', '/', NULL, NULL, 1, TRUE, 1, 1);

INSERT INTO tree_nodes (name, type, path, content, parent_id, workspace_id, created_by, updated_by)
VALUES
  ('app', 'folder', '/web', NULL, 1, 1, 1, 1),
  ('components', 'folder', '/web', NULL, 1, 1, 1, 1),
  ('db', 'folder', '/web', NULL, 1, 1, 1, 1);

INSERT INTO tree_nodes (name, type, path, content, parent_id, workspace_id, created_by, updated_by)
VALUES
  ('page.tsx', 'file', '/web/app', 'export default function Home() {\n  return <div>Hello World</div>;\n}', 2, 1, 1, 1),
  ('layout.tsx', 'file', '/web/app', 'export default function RootLayout({ children }) {\n  return <div>{children}</div>;\n}', 2, 1, 1, 1),
  ('Button.tsx', 'file', '/web/components', 'export const Button = ({ children }) => {\n  return <button>{children}</button>;\n}', 3, 1, 1, 1),
  ('schema.ts', 'file', '/web/db', 'export const schema = {}', 4, 1, 1, 1); 