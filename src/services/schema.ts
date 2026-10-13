// src/services/schema.ts — Migraciones SQL estáticas; los datos usan parámetros.
export const SCHEMA_VERSION = 2;
export const MIGRATIONS = [
  `CREATE TABLE tools (
  id INTEGER PRIMARY KEY, code TEXT NOT NULL UNIQUE CHECK(code IN ('photo','scan','location')),
  name TEXT NOT NULL UNIQUE
);
INSERT INTO tools(id,code,name) VALUES (1,'photo','Cámara'),(2,'scan','Escáner'),(3,'location','GPS');
CREATE TABLE records (
  id INTEGER PRIMARY KEY AUTOINCREMENT, tool_id INTEGER NOT NULL REFERENCES tools(id),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  note TEXT NOT NULL DEFAULT '' CHECK(length(note)<=200)
);
CREATE TABLE photos (
  record_id INTEGER PRIMARY KEY REFERENCES records(id) ON DELETE CASCADE,
  uri TEXT NOT NULL UNIQUE CHECK(uri LIKE 'file://%'),
  width INTEGER NOT NULL CHECK(width>0), height INTEGER NOT NULL CHECK(height>0),
  facing TEXT NOT NULL CHECK(facing IN ('front','back','gallery'))
);
CREATE TABLE scans (
  record_id INTEGER PRIMARY KEY REFERENCES records(id) ON DELETE CASCADE,
  barcode_type TEXT NOT NULL CHECK(length(barcode_type) BETWEEN 1 AND 40),
  content TEXT NOT NULL CHECK(length(trim(content)) BETWEEN 1 AND 8192)
);
CREATE TABLE locations (
  record_id INTEGER PRIMARY KEY REFERENCES records(id) ON DELETE CASCADE,
  latitude REAL NOT NULL CHECK(latitude BETWEEN -90 AND 90),
  longitude REAL NOT NULL CHECK(longitude BETWEEN -180 AND 180),
  accuracy REAL CHECK(accuracy>=0), altitude REAL, speed REAL CHECK(speed>=0),
  heading REAL CHECK(heading BETWEEN 0 AND 360), address TEXT CHECK(length(address)<=500)
);
CREATE TABLE tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE COLLATE NOCASE
  CHECK(length(trim(name)) BETWEEN 1 AND 24)
);
CREATE TABLE record_tags (
  record_id INTEGER NOT NULL REFERENCES records(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY(record_id,tag_id)
);
CREATE TRIGGER photos_tool BEFORE INSERT ON photos
WHEN (SELECT tool_id FROM records WHERE id=NEW.record_id)<>1
BEGIN SELECT RAISE(ABORT,'Tipo de registro incompatible con foto'); END;
CREATE TRIGGER scans_tool BEFORE INSERT ON scans
WHEN (SELECT tool_id FROM records WHERE id=NEW.record_id)<>2
BEGIN SELECT RAISE(ABORT,'Tipo de registro incompatible con código'); END;
CREATE TRIGGER locations_tool BEFORE INSERT ON locations
WHEN (SELECT tool_id FROM records WHERE id=NEW.record_id)<>3
BEGIN SELECT RAISE(ABORT,'Tipo de registro incompatible con GPS'); END;`,
  `CREATE INDEX records_date_idx ON records(created_at DESC,id DESC);
CREATE INDEX records_tool_date_idx ON records(tool_id,created_at DESC);
CREATE INDEX record_tags_tag_idx ON record_tags(tag_id);`,
] as const;
