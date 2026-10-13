// src/pages/BiometricsPage.tsx — Muestra soporte, inscripción y resultado de autenticación.
import { Platform } from 'react-native';
import { AppButton } from '@/components/atoms/AppButton';
import { AppText } from '@/components/atoms/AppText';
import { Card } from '@/components/molecules/Card';
import { StatePanel } from '@/components/molecules/StatePanel';
import { ScreenContainer } from '@/components/organisms/ScreenContainer';
import { useBiometrics } from '@/hooks/useBiometrics';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { openSettings } from '@/services/linkService';
import type { PageProps } from '@/types/components';
export function BiometricsPage(props: PageProps) {
  const biometrics = useBiometrics();
  const settings = useAsyncAction();
  return (
    <ScreenContainer {...props}>
      {Platform.OS === 'web' ? (
        <StatePanel
          title="No disponible en esta plataforma"
          message="La autenticación biométrica se prueba en un teléfono físico."
        />
      ) : biometrics.loading ? (
        <StatePanel
          title="Consultando biometría"
          message="Verificando hardware e inscripción."
          loading
        />
      ) : biometrics.error ? (
        <StatePanel
          title="Error al comprobar biometría"
          message={biometrics.error}
          action={biometrics.refresh}
        />
      ) : (
        <Card>
          <AppText variant="subtitle">Identidad en tu dispositivo</AppText>
          <AppText>
            Hardware: {biometrics.capability?.hardware ? 'disponible' : 'no disponible'}
          </AppText>
          <AppText>
            Huella o rostro registrado: {biometrics.capability?.enrolled ? 'sí' : 'no'}
          </AppText>
          <AppText>Tipos: {biometrics.capability?.types.join(', ') || 'ninguno'}</AppText>
          <AppText muted>
            Android e iOS realizan la verificación. Device Tools recibe solo el resultado, nunca tus
            datos biométricos. El historial se vuelve a bloquear al salir de su pantalla.
          </AppText>
          {biometrics.capability?.available ? (
            <AppButton
              label="Autenticar identidad"
              busy={biometrics.busy}
              onPress={biometrics.authenticate}
            />
          ) : (
            <StatePanel
              title="Biometría no configurada"
              message="Registrá una huella o rostro en los ajustes del dispositivo. El historial ofrece acceso manual explícito cuando no hay biometría."
            />
          )}
          <AppButton label="Actualizar comprobación" secondary onPress={biometrics.refresh} />
          <AppButton
            label="Abrir configuración"
            secondary
            onPress={() => void settings.run(openSettings)}
          />
        </Card>
      )}
      {biometrics.message && (
        <AppText accessibilityLiveRegion="polite">{biometrics.message}</AppText>
      )}
      {settings.message && <AppText>{settings.message}</AppText>}
    </ScreenContainer>
  );
}
