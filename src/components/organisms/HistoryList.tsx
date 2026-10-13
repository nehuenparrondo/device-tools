// src/components/organisms/HistoryList.tsx — Tarjetas tipadas para fotos, códigos y puntos GPS.
import { Image, StyleSheet } from 'react-native';
import { AppButton } from '@/components/atoms/AppButton';
import { AppText } from '@/components/atoms/AppText';
import { Card } from '@/components/molecules/Card';
import type { HistoryRecord } from '@/types/database';
import { formatDate, formatNumber } from '@/utils/formatters';
const LABELS = { photo: 'Fotografía', scan: 'Código escaneado', location: 'Ubicación' } as const;
export function HistoryList({
  records,
  onRemove,
  busy,
}: {
  records: HistoryRecord[];
  onRemove(record: HistoryRecord): void;
  busy: boolean;
}) {
  return (
    <>
      {records.map((record) => (
        <Card key={record.id}>
          <AppText variant="subtitle">{LABELS[record.kind]}</AppText>
          <AppText variant="small" muted>
            {formatDate(record.createdAt)}
          </AppText>
          {record.kind === 'photo' ? (
            <Image
              source={{ uri: record.data.uri }}
              accessibilityLabel="Foto del historial"
              resizeMode="contain"
              style={[styles.photo, { aspectRatio: record.data.width / record.data.height }]}
            />
          ) : record.kind === 'scan' ? (
            <>
              <AppText muted>{record.data.barcodeType}</AppText>
              <AppText selectable>{record.data.content}</AppText>
            </>
          ) : (
            <>
              <AppText selectable>
                {formatNumber(record.data.latitude, '', 6)},{' '}
                {formatNumber(record.data.longitude, '', 6)}
              </AppText>
              <AppText muted>{record.data.address ?? 'Sin dirección legible'}</AppText>
            </>
          )}
          {record.note ? <AppText>{record.note}</AppText> : null}
          {record.tags.length > 0 && (
            <AppText muted>{record.tags.map((tag) => '#' + tag).join(' · ')}</AppText>
          )}
          <AppButton
            label="Eliminar registro"
            danger
            disabled={busy}
            onPress={() => onRemove(record)}
          />
        </Card>
      ))}
    </>
  );
}
const styles = StyleSheet.create({ photo: { width: '100%', maxHeight: 320, borderRadius: 16 } });
