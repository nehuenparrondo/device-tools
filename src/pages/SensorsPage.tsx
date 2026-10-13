// src/pages/SensorsPage.tsx — Compone sensores disponibles, intervalo y feedback al agitar.
import { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { AppButton } from '@/components/atoms/AppButton';
import { AppText } from '@/components/atoms/AppText';
import { Card } from '@/components/molecules/Card';
import { MotionBall } from '@/components/molecules/MotionBall';
import { StatePanel } from '@/components/molecules/StatePanel';
import { ResponsiveGrid } from '@/components/organisms/ResponsiveGrid';
import { ScreenContainer } from '@/components/organisms/ScreenContainer';
import { SensorPanel, SENSOR_STATUS_LABELS } from '@/components/organisms/SensorPanel';
import { DEFAULT_SENSOR_INTERVAL, SENSOR_INTERVALS } from '@/constants/app';
import { useAccelerometer } from '@/hooks/useAccelerometer';
import { useGyroscope } from '@/hooks/useGyroscope';
import { useMagnetometer } from '@/hooks/useMagnetometer';
import { useBarometer } from '@/hooks/useBarometer';
import { usePedometer } from '@/hooks/usePedometer';
import { useShakeDetection } from '@/hooks/useShakeDetection';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { openSettings } from '@/services/linkService';
import type { PageProps } from '@/types/components';
import { formatNumber, getCompassHeading } from '@/utils/formatters';
export function SensorsPage(props: PageProps) {
  const [enabled, setEnabled] = useState(false);
  const [interval, setInterval] = useState<number>(DEFAULT_SENSOR_INTERVAL);
  const accelerometer = useAccelerometer(enabled, interval);
  const gyroscope = useGyroscope(enabled, interval);
  const magnetometer = useMagnetometer(enabled, interval);
  const barometer = useBarometer(enabled, interval);
  const pedometer = usePedometer(enabled);
  const shakes = useShakeDetection(accelerometer.data, accelerometer.status === 'live');
  const settings = useAsyncAction();
  return (
    <ScreenContainer {...props}>
      {Platform.OS === 'web' ? (
        <StatePanel
          title="No disponible en esta plataforma"
          message="Los sensores se prueban desde un teléfono físico."
        />
      ) : (
        <>
          <Card>
            <AppButton
              label={enabled ? 'Detener sensores' : 'Activar sensores'}
              onPress={() => setEnabled((current) => !current)}
            />
            <AppText muted>
              Intervalo de lectura (ms). Los pasos se cuentan solo durante esta sesión.
            </AppText>
            <View style={styles.intervals}>
              {SENSOR_INTERVALS.map((value) => (
                <AppButton
                  key={value}
                  label={`${value} ms${interval === value ? ' ✓' : ''}`}
                  secondary={interval !== value}
                  onPress={() => setInterval(value)}
                />
              ))}
            </View>
          </Card>
          <ResponsiveGrid>
            <SensorPanel title="Acelerómetro" {...accelerometer} unit="g" range={2} />
            <SensorPanel title="Giroscopio" {...gyroscope} unit="rad/s" range={5} />
            <SensorPanel title="Magnetómetro" {...magnetometer} unit="µT" range={100} />
            <Card>
              <AppText variant="subtitle">Movimiento</AppText>
              <MotionBall data={accelerometer.status === 'live' ? accelerometer.data : null} />
              <AppText accessibilityLiveRegion="polite">Sacudidas detectadas: {shakes}</AppText>
            </Card>
            <Card>
              <AppText variant="subtitle">Brújula orientativa</AppText>
              <AppText variant="title">
                {magnetometer.status === 'live' && magnetometer.data
                  ? formatNumber(
                      getCompassHeading(magnetometer.data.x, magnetometer.data.y),
                      '°',
                      0,
                    )
                  : 'Sin lectura'}
              </AppText>
              <AppText muted>
                Ángulo aproximado del campo magnético en el plano del teléfono. Calibrá con un
                movimiento en forma de ocho. No es un instrumento de navegación.
              </AppText>
            </Card>
            <Card>
              <AppText variant="subtitle">Barómetro</AppText>
              <AppText muted>{SENSOR_STATUS_LABELS[barometer.status]}</AppText>
              <AppText>
                {formatNumber(barometer.status === 'live' ? barometer.data?.pressure : null, 'hPa')}
              </AppText>
              {barometer.error && <AppText>{barometer.error}</AppText>}
              {barometer.status === 'denied' && (
                <AppButton
                  label="Abrir configuración"
                  secondary
                  onPress={() => void settings.run(openSettings)}
                />
              )}
            </Card>
            <Card>
              <AppText variant="subtitle">Podómetro</AppText>
              <AppText muted>{SENSOR_STATUS_LABELS[pedometer.status]}</AppText>
              <AppText variant="title">{pedometer.steps} pasos</AppText>
              {pedometer.error && <AppText>{pedometer.error}</AppText>}
              {pedometer.status === 'denied' && (
                <AppButton
                  label="Abrir configuración"
                  secondary
                  onPress={() => void settings.run(openSettings)}
                />
              )}
            </Card>
          </ResponsiveGrid>
          {settings.message && <AppText>{settings.message}</AppText>}
        </>
      )}
    </ScreenContainer>
  );
}
const styles = StyleSheet.create({ intervals: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 } });
