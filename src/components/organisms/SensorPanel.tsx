// src/components/organisms/SensorPanel.tsx — Presenta un sensor con estados y tres ejes.
import { AppButton } from '@/components/atoms/AppButton';
import { AppText } from '@/components/atoms/AppText';
import { SensorGauge } from '@/components/atoms/SensorGauge';
import { Card } from '@/components/molecules/Card';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import type { SensorStatus } from '@/hooks/useLiveSensor';
import { openSettings } from '@/services/linkService';
import type { SensorData } from '@/types/components';
export const SENSOR_STATUS_LABELS = {
  stopped: 'Detenido',
  loading: 'Consultando hardware…',
  live: 'Lectura en vivo',
  unavailable: 'No disponible en este dispositivo',
  denied: 'Permiso denegado',
  error: 'Error de sensor',
} as const;
export function SensorPanel({
  title,
  data,
  status,
  error,
  unit,
  range,
}: {
  title: string;
  data: SensorData | null;
  status: SensorStatus;
  error: string | null;
  unit: string;
  range: number;
}) {
  const action = useAsyncAction();
  return (
    <Card>
      <AppText variant="subtitle">{title}</AppText>
      <AppText muted>{SENSOR_STATUS_LABELS[status]}</AppText>
      {status === 'live' && data && (
        <>
          {(['x', 'y', 'z'] as const).map((axis) => (
            <SensorGauge
              key={axis}
              label={axis.toUpperCase()}
              value={data[axis]}
              unit={unit}
              range={range}
            />
          ))}
        </>
      )}
      {error && <AppText>{error}</AppText>}
      {status === 'denied' && (
        <AppButton
          label="Abrir configuración"
          secondary
          onPress={() => void action.run(openSettings)}
        />
      )}
      {action.message && <AppText>{action.message}</AppText>}
    </Card>
  );
}
