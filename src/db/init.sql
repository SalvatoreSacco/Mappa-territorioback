-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create comuni table
CREATE TABLE IF NOT EXISTS comuni (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  geom GEOMETRY(MULTIPOLYGON, 4326) NOT NULL
);

-- Create GIST index on geometry
CREATE INDEX IF NOT EXISTS idx_comuni_geom ON comuni USING GIST(geom);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

-- Create assegnazioni table (assignments)
CREATE TABLE IF NOT EXISTS assegnazioni (
  id SERIAL PRIMARY KEY,
  comune_id INTEGER NOT NULL REFERENCES comuni(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(comune_id, user_id)
);

-- Create categoria table (operator categories)
CREATE TABLE IF NOT EXISTS categoria (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL UNIQUE
);

-- Create operatori table (operators/staff)
CREATE TABLE IF NOT EXISTS operatori (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  cognome VARCHAR(100) NOT NULL DEFAULT '',
  categoria_id INTEGER NOT NULL REFERENCES categoria(id) ON DELETE CASCADE,
  comune_id INTEGER NOT NULL REFERENCES comuni(id) ON DELETE CASCADE
);

-- Create index on operatori for faster queries
CREATE INDEX IF NOT EXISTS idx_operatori_comune_id ON operatori(comune_id);
CREATE INDEX IF NOT EXISTS idx_operatori_categoria_id ON operatori(categoria_id);
