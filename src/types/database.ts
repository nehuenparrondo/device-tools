// src/types/database.ts — Contratos discriminados para el historial y sus detalles.
export type RecordKind = 'photo' | 'scan' | 'location';
export interface RecordMetadata {
  note: string;
  tags: string[];
}
export interface PhotoData {
  uri: string;
  width: number;
  height: number;
  facing: 'front' | 'back' | 'gallery';
}
export interface ScanData {
  content: string;
  barcodeType: string;
}
export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  altitude: number | null;
  speed: number | null;
  heading: number | null;
  address: string | null;
}
export type RecordInput = RecordMetadata &
  (
    | { kind: 'photo'; data: PhotoData }
    | { kind: 'scan'; data: ScanData }
    | { kind: 'location'; data: LocationData }
  );
export type HistoryRecord = RecordInput & { id: number; createdAt: string };
export interface DatabaseApi {
  initialize(): Promise<void>;
  save(input: RecordInput): Promise<number>;
  list(kind?: RecordKind): Promise<HistoryRecord[]>;
  remove(id: number): Promise<void>;
}
