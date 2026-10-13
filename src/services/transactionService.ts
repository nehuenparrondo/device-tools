// src/services/transactionService.ts — Mantiene las FK en la conexión que ejecuta la transacción.
export interface TransactionDriver {
  execAsync(sql: string): Promise<void>;
}
export async function withTransaction<Result, Driver extends TransactionDriver>(
  database: Driver,
  action: (transaction: Driver) => Promise<Result>,
): Promise<Result> {
  // foreign_keys es por conexión y debe activarse antes de BEGIN, nunca dentro de una transacción.
  await database.execAsync('PRAGMA foreign_keys = ON;');
  await database.execAsync('BEGIN IMMEDIATE;');
  try {
    const result = await action(database);
    await database.execAsync('COMMIT;');
    return result;
  } catch (error) {
    await database.execAsync('ROLLBACK;').catch(() => undefined);
    throw error;
  }
}
