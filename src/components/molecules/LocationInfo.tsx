// src/components/molecules/LocationInfo.tsx — Presenta coordenadas y medidas con unidades.
import { AppText } from '@/components/atoms/AppText';
import { Card } from './Card';
import type { LocationData } from '@/types/database';
import { formatNumber } from '@/utils/formatters';
export function LocationInfo({ position }: { position: LocationData }) {
  return (
    <Card>
      <AppText variant="subtitle">Tu posición</AppText>
      <AppText selectable>Latitud: {formatNumber(position.latitude, '°', 6)}</AppText>
      <AppText selectable>Longitud: {formatNumber(position.longitude, '°', 6)}</AppText>
      <AppText>Precisión: {formatNumber(position.accuracy, 'm')}</AppText>
      <AppText>Altitud: {formatNumber(position.altitude, 'm')}</AppText>
      <AppText>Velocidad: {formatNumber(position.speed, 'm/s')}</AppText>
      <AppText>Dirección de movimiento: {formatNumber(position.heading, '°')}</AppText>
      <AppText muted>{position.address ?? 'Dirección legible no disponible.'}</AppText>
    </Card>
  );
}
