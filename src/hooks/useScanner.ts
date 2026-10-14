// src/hooks/useScanner.ts — Bloquea lecturas repetidas hasta un nuevo escaneo explícito.
import type { BarcodeScanningResult } from 'expo-camera';
import * as Clipboard from 'expo-clipboard';
import { useRef, useState } from 'react';
import { useDatabase } from '@/context/DatabaseContext';
import { databaseService } from '@/services/databaseService';
import { successFeedback } from '@/services/feedbackService';
import { openScannedUrl } from '@/services/linkService';
import type { ScanData } from '@/types/database';
import { parseTags, validateRecord } from '@/utils/validators';
import { getErrorMessage } from '@/utils/formatters';
import { useAsyncAction } from './useAsyncAction';
export function useScanner() {
  const locked = useRef(false);
  const [result, setResult] = useState<ScanData | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [note, setNote] = useState('');
  const [tags, setTags] = useState('');
  const [torch, setTorch] = useState(false);
  const database = useDatabase();
  const action = useAsyncAction();
  function onScan(event: BarcodeScanningResult) {
    if (locked.current) return;
    locked.current = true;
    try {
      const data = { content: event.data, barcodeType: event.type };
      validateRecord({ kind: 'scan', data, note: '', tags: [] });
      setResult(data);
      setSaved(false);
      setScanError(null);
      void successFeedback();
    } catch (error) {
      setScanError(getErrorMessage(error));
    }
  }
  function reset() {
    if (action.isRunning()) return;
    locked.current = false;
    setResult(null);
    setSaved(false);
    setScanError(null);
    setNote('');
    setTags('');
    setTorch(false);
  }
  function save() {
    void action.run(async () => {
      if (!result || saved) return;
      if (!database.ready)
        throw new Error(database.error ?? 'La base de datos todavía se está preparando.');
      await databaseService.save({ kind: 'scan', data: result, note, tags: parseTags(tags) });
      setSaved(true);
      return 'Código guardado en el historial.';
    });
  }
  function copy() {
    void action.run(async () => {
      if (result) {
        await Clipboard.setStringAsync(result.content);
        return 'Contenido copiado.';
      }
    });
  }
  function open() {
    void action.run(async () => {
      if (result) await openScannedUrl(result.content);
    });
  }
  return {
    result,
    saved,
    note,
    setNote,
    tags,
    setTags,
    onScan,
    reset,
    save,
    copy,
    open,
    torch,
    toggleTorch: () => setTorch((current) => !current),
    scanError,
    ...action,
  };
}
