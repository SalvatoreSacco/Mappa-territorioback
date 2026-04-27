-- Insert test user
INSERT INTO users (name) VALUES ('Test User') ON CONFLICT DO NOTHING;

-- Insert test comune (simple MULTIPOLYGON for testing)
INSERT INTO comuni (nome, geom)
VALUES (
  'Test Comune',
  ST_GeomFromText('MULTIPOLYGON(((0 0, 1 0, 1 1, 0 1, 0 0)))', 4326)
)
ON CONFLICT DO NOTHING;

-- Insert operator categories
INSERT INTO categoria (nome) VALUES ('OSS'), ('Infermieri'), ('Fisioterapisti'), ('Medici'), ('Logistica')
ON CONFLICT (nome) DO NOTHING;

-- Insert test operators for Test Comune
INSERT INTO operatori (nome, categoria_id, comune_id)
VALUES 
  ('Marco Rossi', (SELECT id FROM categoria WHERE nome = 'OSS'), 1),
  ('Anna Bianchi', (SELECT id FROM categoria WHERE nome = 'OSS'), 1),
  ('Giovanni Verdi', (SELECT id FROM categoria WHERE nome = 'Infermieri'), 1),
  ('Laura Ferrari', (SELECT id FROM categoria WHERE nome = 'Infermieri'), 1),
  ('Paolo Russo', (SELECT id FROM categoria WHERE nome = 'Fisioterapisti'), 1),
  ('Sandra Gallo', (SELECT id FROM categoria WHERE nome = 'Medici'), 1)
ON CONFLICT DO NOTHING;
