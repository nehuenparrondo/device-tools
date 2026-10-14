// src/components/organisms/CameraViewport.tsx — Un único visor adaptable con controles superpuestos.
import { CameraView, type BarcodeScanningResult } from 'expo-camera';
import type { ReactNode, RefObject } from 'react';
import { StyleSheet, View } from 'react-native';
interface Props {
  cameraRef?: RefObject<CameraView | null>;
  sessionId?: number;
  facing?: 'front' | 'back';
  flash?: boolean;
  torch?: boolean;
  onReady?(): void;
  onError(message: string): void;
  onScan?(event: BarcodeScanningResult): void;
  children?: ReactNode;
}
export function CameraViewport({
  cameraRef,
  sessionId = 0,
  facing = 'back',
  flash = false,
  torch = false,
  onReady,
  onError,
  onScan,
  children,
}: Props) {
  return (
    <View style={styles.container}>
      <CameraView
        key={`${sessionId}-${facing}`}
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing={facing}
        flash={flash ? 'on' : 'off'}
        enableTorch={torch && facing === 'back'}
        onCameraReady={onReady}
        onMountError={(event) => onError(event.message)}
        onBarcodeScanned={onScan}
        barcodeScannerSettings={{
          barcodeTypes: [
            'qr',
            'ean13',
            'ean8',
            'code128',
            'code39',
            'upc_a',
            'upc_e',
            'pdf417',
            'datamatrix',
            'aztec',
            'itf14',
            'codabar',
            'code93',
          ],
        }}
      />
      {children}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, overflow: 'hidden', borderRadius: 24, backgroundColor: '#000000' },
});
