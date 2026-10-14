// src/utils/withTimeout.ts — Libera esperas de hardware sin dejar temporizadores pendientes.
export async function withTimeout<Value>(
  action: Promise<Value>,
  milliseconds: number,
  message: string,
): Promise<Value> {
  if (!Number.isFinite(milliseconds) || milliseconds <= 0)
    throw new Error('Tiempo de espera inválido.');
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      action,
      new Promise<never>((_resolve, reject) => {
        timeout = setTimeout(() => reject(new Error(message)), milliseconds);
      }),
    ]);
  } finally {
    if (timeout !== undefined) clearTimeout(timeout);
  }
}
