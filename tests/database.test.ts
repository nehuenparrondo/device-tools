// tests/database.test.ts — Verifica SQL real con el motor SQLite incluido en Node.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { test } from 'node:test';
import { MIGRATIONS, SCHEMA_VERSION } from '../src/services/schema.ts';
import { withTransaction } from '../src/services/transactionService.ts';
function openTestDatabase(): DatabaseSync {
  const database = new DatabaseSync(':memory:');
  database.exec('PRAGMA foreign_keys=ON;');
  for (const [index, sql] of MIGRATIONS.entries()) {
    database.exec('BEGIN;');
    database.exec(sql);
    database.exec(`PRAGMA user_version=${index + 1}; COMMIT;`);
  }
  return database;
}
test('la transacción de la app activa FK antes de BEGIN y conserva la cascada', async () => {
  const database = openTestDatabase();
  try {
    database.exec('PRAGMA foreign_keys=OFF;');
    const driver = {
      execAsync: async (sql: string) => {
        database.exec(sql);
      },
    };
    await withTransaction(driver, async () => {
      assert.equal(database.prepare('PRAGMA foreign_keys').get()?.foreign_keys, 1);
      database.exec(
        "INSERT INTO records(id,tool_id) VALUES (1,2); INSERT INTO scans VALUES (1,'qr','prueba');",
      );
    });
    await withTransaction(driver, async () => {
      database.prepare('DELETE FROM records WHERE id=?').run(1);
    });
    assert.equal(database.prepare('SELECT COUNT(*) AS count FROM scans').get()?.count, 0);
  } finally {
    database.close();
  }
});
test('la transacción de la app revierte errores y permite el siguiente guardado', async () => {
  const database = openTestDatabase();
  try {
    const driver = {
      execAsync: async (sql: string) => {
        database.exec(sql);
      },
    };
    await assert.rejects(
      withTransaction(driver, async () => {
        database.prepare('INSERT INTO records(id,tool_id) VALUES (?,?)').run(1, 1);
        database
          .prepare('INSERT INTO photos(record_id,uri,width,height,facing) VALUES (?,?,?,?,?)')
          .run(1, 'file:///bad.jpg', 0, 100, 'back');
      }),
    );
    assert.equal(database.prepare('SELECT COUNT(*) AS count FROM records').get()?.count, 0);
    await withTransaction(driver, async () => {
      database.prepare('INSERT INTO records(id,tool_id) VALUES (?,?)').run(2, 3);
      database
        .prepare('INSERT INTO locations(record_id,latitude,longitude) VALUES (?,?,?)')
        .run(2, 0, 0);
    });
    assert.equal(database.prepare('SELECT COUNT(*) AS count FROM records').get()?.count, 1);
  } finally {
    database.close();
  }
});
test('las migraciones crean esquema, catálogos e índices y registran user_version', () => {
  const database = openTestDatabase();
  try {
    assert.equal(database.prepare('PRAGMA user_version').get()?.user_version, SCHEMA_VERSION);
    assert.equal(database.prepare('SELECT COUNT(*) AS count FROM tools').get()?.count, 3);
    assert.equal(
      database
        .prepare(
          "SELECT COUNT(*) AS count FROM sqlite_master WHERE type='index' AND name LIKE 'records_%'",
        )
        .get()?.count,
      2,
    );
  } finally {
    database.close();
  }
});
test('el SQL de entrega coincide con las migraciones y los ejemplos son ejecutables', () => {
  const database = new DatabaseSync(':memory:');
  try {
    database.exec(readFileSync(new URL('../database/schema.sql', import.meta.url), 'utf8'));
    database.exec(readFileSync(new URL('../database/seed.sql', import.meta.url), 'utf8'));
    assert.equal(database.prepare('PRAGMA user_version').get()?.user_version, SCHEMA_VERSION);
    assert.equal(database.prepare('SELECT COUNT(*) AS count FROM records').get()?.count, 3);
    database.exec(readFileSync(new URL('../database/queries.sql', import.meta.url), 'utf8'));
  } finally {
    database.close();
  }
});
test('PK, FK, UNIQUE, CHECK y triggers impiden datos inconsistentes', () => {
  const database = openTestDatabase();
  try {
    assert.throws(() => database.prepare('INSERT INTO records(tool_id) VALUES (?)').run(99));
    database.prepare('INSERT INTO records(id,tool_id) VALUES (?,?)').run(1, 3);
    assert.throws(() =>
      database
        .prepare('INSERT INTO locations(record_id,latitude,longitude) VALUES (?,?,?)')
        .run(1, 91, 0),
    );
    assert.throws(() =>
      database
        .prepare('INSERT INTO scans(record_id,barcode_type,content) VALUES (?,?,?)')
        .run(1, 'qr', 'hola'),
    );
    database.prepare('INSERT INTO tags(name) VALUES (?)').run('clase');
    assert.throws(() => database.prepare('INSERT INTO tags(name) VALUES (?)').run('CLASE'));
  } finally {
    database.close();
  }
});
test('los parámetros conservan intentos de inyección como texto', () => {
  const database = openTestDatabase();
  try {
    const content = "hola'); DROP TABLE records; --";
    database.prepare('INSERT INTO records(id,tool_id) VALUES (?,?)').run(1, 2);
    database
      .prepare('INSERT INTO scans(record_id,barcode_type,content) VALUES (?,?,?)')
      .run(1, 'qr', content);
    assert.equal(
      database.prepare('SELECT content FROM scans WHERE record_id=?').get(1)?.content,
      content,
    );
    assert.equal(database.prepare('SELECT COUNT(*) AS count FROM records').get()?.count, 1);
  } finally {
    database.close();
  }
});
test('borrado en cascada elimina detalles y relaciones sin eliminar etiquetas compartidas', () => {
  const database = openTestDatabase();
  try {
    database.exec(
      "INSERT INTO records(id,tool_id) VALUES (1,2),(2,2); INSERT INTO scans VALUES (1,'qr','uno'),(2,'qr','dos'); INSERT INTO tags(id,name) VALUES (1,'clase'); INSERT INTO record_tags VALUES (1,1),(2,1);",
    );
    database.prepare('DELETE FROM records WHERE id=?').run(1);
    assert.equal(database.prepare('SELECT COUNT(*) AS count FROM scans').get()?.count, 1);
    assert.equal(database.prepare('SELECT COUNT(*) AS count FROM record_tags').get()?.count, 1);
    assert.equal(database.prepare('SELECT COUNT(*) AS count FROM tags').get()?.count, 1);
  } finally {
    database.close();
  }
});
test('una escritura fallida permite rollback de registro y detalle', () => {
  const database = openTestDatabase();
  try {
    database.exec('BEGIN;');
    database.prepare('INSERT INTO records(id,tool_id) VALUES (?,?)').run(1, 1);
    assert.throws(() =>
      database
        .prepare('INSERT INTO photos(record_id,uri,width,height,facing) VALUES (?,?,?,?,?)')
        .run(1, 'file:///invalid.jpg', 0, 100, 'back'),
    );
    database.exec('ROLLBACK;');
    assert.equal(database.prepare('SELECT COUNT(*) AS count FROM records').get()?.count, 0);
  } finally {
    database.close();
  }
});
