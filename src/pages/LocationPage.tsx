// src/pages/LocationPage.tsx — Compone GPS, seguimiento y registro de puntos.
import { Platform } from 'react-native';
import { AppButton } from '@/components/atoms/AppButton';
import { AppText } from '@/components/atoms/AppText';
import { Card } from '@/components/molecules/Card';
import { LocationInfo } from '@/components/molecules/LocationInfo';
import { MetadataForm } from '@/components/molecules/MetadataForm';
import { StatePanel } from '@/components/molecules/StatePanel';
import { ResponsiveGrid } from '@/components/organisms/ResponsiveGrid';
import { ScreenContainer } from '@/components/organisms/ScreenContainer';
import { useLocation } from '@/hooks/useLocation';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { openSettings } from '@/services/linkService';
import type { PageProps } from '@/types/components';
export function LocationPage(props: PageProps) {
  const gps = useLocation();
  const settings = useAsyncAction();
  return (
    <ScreenContainer {...props}>
      {Platform.OS === 'web' ? (
        <StatePanel
          title="No disponible en esta plataforma"
          message="Probá el GPS en el APK o en un dispositivo físico con Expo."
        />
      ) : (
        <>
          <Card>
            <AppText muted>
              La ubicación se consulta solo mientras usás esta pantalla. La precisión varía según
              señal y entorno.
            </AppText>
            <AppButton label="Obtener ubicación actual" busy={gps.busy} onPress={gps.current} />
            <AppButton
              label={gps.tracking ? 'Detener seguimiento' : 'Iniciar seguimiento en vivo'}
              secondary
              disabled={gps.busy}
              onPress={gps.tracking ? gps.stop : gps.start}
            />
            <AppText>Seguimiento: {gps.tracking ? 'activo' : 'detenido'}</AppText>
          </Card>
          {gps.position ? (
            <ResponsiveGrid>
              <LocationInfo position={gps.position} />
              <Card>
                <MetadataForm
                  note={gps.note}
                  tags={gps.tags}
                  onNoteChange={gps.setNote}
                  onTagsChange={gps.setTags}
                />
                <AppButton label="Guardar punto" busy={gps.busy} onPress={gps.save} />
                <AppButton label="Abrir en mapas" secondary onPress={gps.map} />
                <AppButton
                  label="Consultar dirección"
                  secondary
                  busy={gps.busy}
                  onPress={gps.address}
                />
              </Card>
            </ResponsiveGrid>
          ) : (
            <StatePanel
              title="Todavía no hay una ubicación"
              message="Obtené la posición actual o iniciá el seguimiento."
            />
          )}
          {(gps.failed || gps.gpsError) && (
            <StatePanel
              title="No se pudo usar el GPS"
              message={gps.gpsError ?? gps.message ?? 'Revisá los permisos y la señal.'}
              action={() => void settings.run(openSettings)}
              actionLabel="Abrir configuración"
            />
          )}
          {gps.message && !gps.failed && (
            <AppText accessibilityLiveRegion="polite">{gps.message}</AppText>
          )}
          {settings.message && <AppText>{settings.message}</AppText>}
        </>
      )}
    </ScreenContainer>
  );
}
