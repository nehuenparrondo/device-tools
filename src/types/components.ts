// src/types/components.ts — Props de páginas y estados reutilizables.
export interface PageProps {
  title: string;
  subtitle: string;
}
export type Availability = 'available' | 'pending' | 'unavailable' | 'error';
export interface SensorData {
  x: number;
  y: number;
  z: number;
}
export interface Removable {
  remove(): void;
}
