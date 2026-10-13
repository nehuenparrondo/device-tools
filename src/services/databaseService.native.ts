// src/services/databaseService.native.ts — SQLite offline con migraciones y transacciones.
import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';
import type { DatabaseApi, HistoryRecord, RecordInput, RecordKind } from '@/types/database';
import { validateRecord } from '@/utils/validators';
import { MIGRATIONS, SCHEMA_VERSION } from './schema';
import { withTransaction } from './transactionService';

let connection: Promise<SQLiteDatabase> | null = null;
// La conexión es privada y todas las lecturas/escrituras se serializan para aislar las transacciones.
let writeQueue: Promise<unknown> = Promise.resolve();
function enqueue<Result>(action: () => Promise<Result>): Promise<Result> {
  const task = writeQueue.then(action);
  writeQueue = task.catch(() => undefined);
  return task;
}
async function getDatabase(): Promise<SQLiteDatabase> {
  if (!connection) {
    connection = (async () => {
      const database = await openDatabaseAsync('device-tools.db');
      try {
        await database.execAsync('PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;');
        const version = await database.getFirstAsync<{ user_version: number }>(
          'PRAGMA user_version',
        );
        const current = version?.user_version ?? 0;
        if (current > SCHEMA_VERSION)
          throw new Error('La base de datos requiere una versión más nueva de la app.');
        for (let migrationIndex = current; migrationIndex < SCHEMA_VERSION; migrationIndex++) {
          const sql = MIGRATIONS[migrationIndex];
          if (!sql) throw new Error('Falta una migración.');
          await withTransaction(database, async (transaction) => {
            await transaction.execAsync(sql);
            await transaction.execAsync(`PRAGMA user_version = ${migrationIndex + 1}`);
          });
        }
        return database;
      } catch (error) {
        await database.closeAsync().catch(() => undefined);
        throw error;
      }
    })().catch((error: unknown) => {
      connection = null;
      throw error;
    });
  }
  return connection;
}
const TOOL_IDS = { photo: 1, scan: 2, location: 3 } as const;
async function save(input: RecordInput): Promise<number> {
  validateRecord(input);
  return enqueue(async () => {
    const database = await getDatabase();
    let recordId = 0;
    await withTransaction(database, async (transaction) => {
      const result = await transaction.runAsync(
        'INSERT INTO records(tool_id,note) VALUES (?,?)',
        TOOL_IDS[input.kind],
        input.note.trim(),
      );
      recordId = result.lastInsertRowId;
      if (input.kind === 'photo') {
        const { uri, width, height, facing } = input.data;
        await transaction.runAsync(
          'INSERT INTO photos(record_id,uri,width,height,facing) VALUES (?,?,?,?,?)',
          recordId,
          uri,
          width,
          height,
          facing,
        );
      } else if (input.kind === 'scan') {
        await transaction.runAsync(
          'INSERT INTO scans(record_id,barcode_type,content) VALUES (?,?,?)',
          recordId,
          input.data.barcodeType,
          input.data.content,
        );
      } else {
        const { latitude, longitude, accuracy, altitude, speed, heading, address } = input.data;
        await transaction.runAsync(
          'INSERT INTO locations(record_id,latitude,longitude,accuracy,altitude,speed,heading,address) VALUES (?,?,?,?,?,?,?,?)',
          recordId,
          latitude,
          longitude,
          accuracy,
          altitude,
          speed,
          heading,
          address,
        );
      }
      for (const name of new Set(input.tags.map((tag) => tag.trim().toLowerCase()))) {
        await transaction.runAsync(
          'INSERT INTO tags(name) VALUES (?) ON CONFLICT(name) DO NOTHING',
          name,
        );
        await transaction.runAsync(
          'INSERT INTO record_tags(record_id,tag_id) SELECT ?,id FROM tags WHERE name=?',
          recordId,
          name,
        );
      }
    });
    return recordId;
  });
}
interface RecordRow {
  id: number;
  code: RecordKind;
  created_at: string;
  note: string;
}
async function list(kind?: RecordKind): Promise<HistoryRecord[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<RecordRow>(
    'SELECT r.id,t.code,r.created_at,r.note FROM records r JOIN tools t ON t.id=r.tool_id WHERE (? IS NULL OR t.code=?) ORDER BY r.created_at DESC,r.id DESC',
    kind ?? null,
    kind ?? null,
  );
  const results: HistoryRecord[] = [];
  for (const row of rows) {
    const tags = await database.getAllAsync<{ name: string }>(
      'SELECT t.name FROM tags t JOIN record_tags rt ON rt.tag_id=t.id WHERE rt.record_id=? ORDER BY t.name',
      row.id,
    );
    const base = {
      id: row.id,
      createdAt: row.created_at,
      note: row.note,
      tags: tags.map((tag) => tag.name),
    };
    if (row.code === 'photo') {
      const detail = await database.getFirstAsync<{
        uri: string;
        width: number;
        height: number;
        facing: 'front' | 'back' | 'gallery';
      }>('SELECT uri,width,height,facing FROM photos WHERE record_id=?', row.id);
      if (detail) results.push({ ...base, kind: 'photo', data: detail });
    } else if (row.code === 'scan') {
      const detail = await database.getFirstAsync<{ content: string; barcodeType: string }>(
        'SELECT content,barcode_type AS barcodeType FROM scans WHERE record_id=?',
        row.id,
      );
      if (detail) results.push({ ...base, kind: 'scan', data: detail });
    } else {
      const detail = await database.getFirstAsync<{
        latitude: number;
        longitude: number;
        accuracy: number | null;
        altitude: number | null;
        speed: number | null;
        heading: number | null;
        address: string | null;
      }>(
        'SELECT latitude,longitude,accuracy,altitude,speed,heading,address FROM locations WHERE record_id=?',
        row.id,
      );
      if (detail) results.push({ ...base, kind: 'location', data: detail });
    }
  }
  return results;
}
export const databaseService: DatabaseApi = {
  initialize: async () => {
    await getDatabase();
  },
  save,
  list: (kind) => enqueue(() => list(kind)),
  remove: async (id) =>
    enqueue(async () => {
      if (!Number.isSafeInteger(id) || id <= 0) throw new Error('Registro inválido.');
      const database = await getDatabase();
      await withTransaction(database, async (transaction) => {
        await transaction.runAsync('DELETE FROM records WHERE id=?', id);
        await transaction.runAsync(
          'DELETE FROM tags WHERE NOT EXISTS (SELECT 1 FROM record_tags WHERE tag_id=tags.id)',
        );
      });
    }),
};
