// src/pages/ScannerPage.tsx — Lector QR y barras con confirmación de enlaces externos.
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppButton } from '@/components/atoms/AppButton';
import { AppText } from '@/components/atoms/AppText';
import { Card } from '@/components/molecules/Card';
import { MetadataForm } from '@/components/molecules/MetadataForm';
import { PermissionGate } from '@/components/molecules/PermissionGate';
import { StatePanel } from '@/components/molecules/StatePanel';
import { CameraViewport } from '@/components/organisms/CameraViewport';
import { ScannerGuide } from '@/components/organisms/ScannerGuide';
import { ScreenContainer } from '@/components/organisms/ScreenContainer';
import { useActiveScreen } from '@/hooks/useActiveScreen';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useCameraPermission } from '@/hooks/useCameraPermission';
import { useScanner } from '@/hooks/useScanner';
import type { PageProps } from '@/types/components';
import { getSafeUrl } from '@/utils/validators';
export function ScannerPage(props: PageProps) {
  const scanner = useScanner();
  const { permission, requestPermission, supported } = useCameraPermission();
  const active = useActiveScreen();
  const { height, landscape } = useBreakpoint();
  const [mountError, setMountError] = useState<string | null>(null);
  return (
    <ScreenContainer {...props}>
      {!supported ? (
        <StatePanel
          title="No disponible en esta plataforma"
          message="Escaneá los códigos desde un dispositivo físico."
        />
      ) : !permission ? (
        <StatePanel title="Preparando escáner" message="Consultando permiso de cámara." loading />
      ) : (
        <PermissionGate
          granted={permission.granted}
          canAskAgain={permission.canAskAgain}
          permissionName="cámara"
          request={requestPermission}
        >
          {scanner.result ? (
            <Card>
              <AppText variant="subtitle">Código detectado · {scanner.result.barcodeType}</AppText>
              <AppText selectable>{scanner.result.content}</AppText>
              <MetadataForm
                note={scanner.note}
                tags={scanner.tags}
                onNoteChange={scanner.setNote}
                onTagsChange={scanner.setTags}
              />
              <AppButton
                label={scanner.saved ? 'Guardado en historial' : 'Guardar en historial'}
                disabled={scanner.saved}
                busy={scanner.busy}
                onPress={scanner.save}
              />
              <AppButton
                label="Copiar contenido"
                secondary
                disabled={scanner.busy}
                onPress={scanner.copy}
              />
              {getSafeUrl(scanner.result.content) && (
                <AppButton
                  label="Abrir enlace"
                  secondary
                  disabled={scanner.busy}
                  onPress={scanner.open}
                />
              )}
              <AppButton
                label="Escanear otro código"
                secondary
                disabled={scanner.busy}
                onPress={scanner.reset}
              />
            </Card>
          ) : mountError ? (
            <StatePanel
              title="Cámara no disponible"
              message={mountError}
              action={() => setMountError(null)}
            />
          ) : active ? (
            <>
              <View style={[styles.preview, { height: height * (landscape ? 0.65 : 0.5) }]}>
                <CameraViewport
                  onError={setMountError}
                  onScan={scanner.onScan}
                  torch={scanner.torch}
                >
                  <ScannerGuide />
                </CameraViewport>
              </View>
              <AppButton
                label={scanner.torch ? 'Apagar linterna' : 'Encender linterna'}
                secondary
                onPress={scanner.toggleTorch}
              />
              <AppText muted>
                Centrál el código dentro del marco. Las lecturas se pausan después del primer
                resultado.
              </AppText>
            </>
          ) : null}
          {scanner.scanError && (
            <StatePanel
              title="Código inválido"
              message={scanner.scanError}
              action={scanner.reset}
            />
          )}
          {scanner.message && <AppText accessibilityLiveRegion="polite">{scanner.message}</AppText>}
        </PermissionGate>
      )}
    </ScreenContainer>
  );
}
const styles = StyleSheet.create({ preview: { width: '100%', minHeight: 180 } });
