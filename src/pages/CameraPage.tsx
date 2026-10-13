// src/pages/CameraPage.tsx — Compone captura, previsualización y guardado de fotografías.
import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '@/components/atoms/AppButton';
import { AppText } from '@/components/atoms/AppText';
import { Card } from '@/components/molecules/Card';
import { MetadataForm } from '@/components/molecules/MetadataForm';
import { PermissionGate } from '@/components/molecules/PermissionGate';
import { StatePanel } from '@/components/molecules/StatePanel';
import { CameraViewport } from '@/components/organisms/CameraViewport';
import { CameraControls } from '@/components/organisms/CameraControls';
import { ScreenContainer } from '@/components/organisms/ScreenContainer';
import { useActiveScreen } from '@/hooks/useActiveScreen';
import { useCamera } from '@/hooks/useCamera';
import { useCameraPermission } from '@/hooks/useCameraPermission';
import { useTheme } from '@/hooks/useTheme';
import type { PageProps } from '@/types/components';
export function CameraPage(props: PageProps) {
  const camera = useCamera();
  const { permission, requestPermission, supported } = useCameraPermission();
  const active = useActiveScreen();
  const { colors } = useTheme();
  const [mountError, setMountError] = useState<string | null>(null);
  if (!supported)
    return (
      <ScreenContainer {...props}>
        <StatePanel
          title="No disponible en esta plataforma"
          message="La captura y el guardado local requieren un dispositivo físico Android o iOS."
        />
      </ScreenContainer>
    );
  if (!permission)
    return (
      <ScreenContainer {...props}>
        <StatePanel title="Preparando cámara" message="Consultando el permiso actual." loading />
      </ScreenContainer>
    );
  if (!permission.granted)
    return (
      <ScreenContainer {...props}>
        <PermissionGate
          granted={false}
          canAskAgain={permission.canAskAgain}
          permissionName="cámara"
          request={requestPermission}
        >
          <View />
        </PermissionGate>
      </ScreenContainer>
    );
  if (camera.photo)
    return (
      <ScreenContainer {...props}>
        <Card>
          <Image
            accessibilityLabel="Foto recién tomada"
            source={{ uri: camera.photo.uri }}
            style={[styles.photo, { aspectRatio: camera.photo.width / camera.photo.height }]}
            resizeMode="contain"
          />
          <MetadataForm
            note={camera.note}
            tags={camera.tags}
            onNoteChange={camera.setNote}
            onTagsChange={camera.setTags}
          />
          <AppButton
            label={camera.saved ? 'Guardada en historial' : 'Guardar en historial'}
            disabled={camera.saved}
            busy={camera.busy}
            onPress={camera.save}
          />
          <AppButton
            label="Guardar en galería"
            secondary
            busy={camera.busy}
            onPress={camera.gallery}
          />
          <AppButton label="Tomar otra foto" secondary onPress={camera.reset} />
          {camera.message && <AppText accessibilityLiveRegion="polite">{camera.message}</AppText>}
          {camera.failed && (
            <AppButton
              label="Abrir configuración de permisos"
              secondary
              onPress={camera.settings}
            />
          )}
        </Card>
      </ScreenContainer>
    );
  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.screen, { backgroundColor: colors.background }]}
    >
      <AppText variant="subtitle" accessibilityRole="header">
        {props.title}
      </AppText>
      {mountError ? (
        <StatePanel
          title="No se pudo abrir la cámara"
          message={mountError}
          action={() => setMountError(null)}
        />
      ) : active ? (
        <CameraViewport
          cameraRef={camera.cameraRef}
          facing={camera.facing}
          flash={camera.flash}
          torch={camera.torch}
          onReady={() => camera.setReady(true)}
          onError={setMountError}
        >
          <CameraControls
            ready={camera.ready}
            busy={camera.busy}
            facing={camera.facing}
            flash={camera.flash}
            torch={camera.torch}
            onCapture={camera.capture}
            onFlip={camera.flip}
            onFlash={camera.toggleFlash}
            onTorch={camera.toggleTorch}
          />
        </CameraViewport>
      ) : (
        <StatePanel title="Cámara pausada" message="Volvé a esta pantalla para usar la cámara." />
      )}
      {camera.message && <AppText accessibilityLiveRegion="polite">{camera.message}</AppText>}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16, gap: 12 },
  photo: { width: '100%', maxHeight: 500, borderRadius: 16 },
});
