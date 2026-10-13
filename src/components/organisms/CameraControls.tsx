// src/components/organisms/CameraControls.tsx — Controles horizontales sin cubrir la acción flotante.
import { ScrollView, StyleSheet } from 'react-native';
import { AppButton } from '@/components/atoms/AppButton';
interface Props {
  ready: boolean;
  busy: boolean;
  flash: boolean;
  torch: boolean;
  facing: 'front' | 'back';
  onCapture(): void;
  onFlip(): void;
  onFlash(): void;
  onTorch(): void;
}
export function CameraControls({
  ready,
  busy,
  flash,
  torch,
  facing,
  onCapture,
  onFlip,
  onFlash,
  onTorch,
}: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator
      style={styles.overlay}
      contentContainerStyle={styles.controls}
    >
      <AppButton label="Tomar foto" disabled={!ready} busy={busy} onPress={onCapture} />
      <AppButton label="Cambiar cámara" secondary disabled={busy} onPress={onFlip} />
      <AppButton
        label={flash ? 'Flash encendido' : 'Flash apagado'}
        secondary
        disabled={busy}
        onPress={onFlash}
      />
      {facing === 'back' && (
        <AppButton
          label={torch ? 'Apagar linterna' : 'Encender linterna'}
          secondary
          disabled={busy}
          onPress={onTorch}
        />
      )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  overlay: { position: 'absolute', bottom: 16, left: 16, right: 80, maxHeight: 90 },
  controls: { flexDirection: 'row', gap: 8, alignItems: 'center', paddingBottom: 8 },
});
