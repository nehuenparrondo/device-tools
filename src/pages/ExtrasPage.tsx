// src/pages/ExtrasPage.tsx — Batería, conexión, galería, voz, brillo y portapapeles.
import { Platform, StyleSheet, TextInput, View } from 'react-native';
import { AppButton } from '@/components/atoms/AppButton';
import { AppText } from '@/components/atoms/AppText';
import { Card } from '@/components/molecules/Card';
import { StatePanel } from '@/components/molecules/StatePanel';
import { ResponsiveGrid } from '@/components/organisms/ResponsiveGrid';
import { ScreenContainer } from '@/components/organisms/ScreenContainer';
import { useExtras } from '@/hooks/useExtras';
import { useTheme } from '@/hooks/useTheme';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { openSettings } from '@/services/linkService';
import type { PageProps } from '@/types/components';
import { formatNumber } from '@/utils/formatters';
export function ExtrasPage(props: PageProps) {
  const extras = useExtras();
  const { colors } = useTheme();
  const settings = useAsyncAction();
  const snapshot = extras.snapshot;
  return (
    <ScreenContainer {...props}>
      {Platform.OS === 'web' && (
        <StatePanel
          title="Funciones nativas no disponibles en esta plataforma"
          message="En web podés probar el diseño y el portapapeles. Para las demás herramientas, usá un teléfono físico."
        />
      )}
      <ResponsiveGrid>
        <Card>
          <AppText variant="subtitle">Batería y conexión</AppText>
          {snapshot ? (
            <>
              <AppText variant="title">
                {formatNumber(snapshot.battery === null ? null : snapshot.battery * 100, '%', 0)}
              </AppText>
              <AppText>{snapshot.batteryState}</AppText>
              <AppText>Red: {snapshot.network}</AppText>
              <AppText>
                Conectado:{' '}
                {snapshot.connected === null ? 'desconocido' : snapshot.connected ? 'sí' : 'no'}
              </AppText>
              <AppText>
                Internet:{' '}
                {snapshot.internet === null
                  ? 'desconocido'
                  : snapshot.internet
                    ? 'disponible'
                    : 'sin acceso'}
              </AppText>
            </>
          ) : (
            <AppText muted>Consultando información…</AppText>
          )}
          <AppButton label="Actualizar información" secondary onPress={extras.refresh} />
        </Card>
        <Card>
          <AppText variant="subtitle">Tu dispositivo</AppText>
          <AppText>{snapshot?.deviceName ?? 'Consultando…'}</AppText>
          <AppText>{snapshot?.system}</AppText>
          <AppText muted>
            {snapshot?.physical ? 'Dispositivo físico' : 'Navegador o emulador'}
          </AppText>
          <AppText muted>No se consultan identificadores privados ni contactos.</AppText>
        </Card>
        <Card>
          <AppText variant="subtitle">Galería y háptica</AppText>
          <AppText muted>Seleccioná una imagen y guardá una copia privada en tu historial.</AppText>
          <AppButton
            label="Seleccionar imagen"
            disabled={Platform.OS === 'web'}
            busy={extras.busy}
            onPress={extras.gallery}
          />
          <AppButton
            label="Probar feedback háptico"
            secondary
            disabled={Platform.OS === 'web'}
            onPress={extras.haptic}
          />
          <AppButton
            label="Abrir configuración de permisos"
            secondary
            disabled={Platform.OS === 'web'}
            onPress={() => void settings.run(openSettings)}
          />
        </Card>
        <Card>
          <AppText variant="subtitle">Brillo de la pantalla</AppText>
          <AppText>
            {formatNumber(extras.brightness === null ? null : extras.brightness * 100, '%', 0)}
          </AppText>
          <AppText muted>
            Se ajusta durante esta sesión y se restaura al salir de la pantalla.
          </AppText>
          <AppButton
            label="Consultar brillo"
            secondary
            disabled={Platform.OS === 'web'}
            onPress={extras.getBrightness}
          />
          <View style={styles.row}>
            {[0.25, 0.5, 0.75, 1].map((value) => (
              <AppButton
                key={value}
                label={`${value * 100}%`}
                secondary
                disabled={Platform.OS === 'web' || extras.busy}
                onPress={() => extras.changeBrightness(value)}
              />
            ))}
          </View>
        </Card>
        <Card>
          <AppText variant="subtitle">Texto, voz y portapapeles</AppText>
          <TextInput
            accessibilityLabel="Texto para leer o copiar"
            multiline
            maxLength={500}
            value={extras.text}
            onChangeText={extras.setText}
            style={[
              styles.input,
              {
                color: colors.text,
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          />
          <AppButton
            label="Leer en voz alta"
            disabled={Platform.OS === 'web'}
            busy={extras.busy}
            onPress={extras.speak}
          />
          <AppButton
            label="Detener lectura"
            secondary
            disabled={Platform.OS === 'web'}
            onPress={extras.stopSpeech}
          />
          <AppButton label="Copiar texto" secondary onPress={extras.copy} />
          <AppButton label="Leer portapapeles" secondary onPress={extras.paste} />
        </Card>
      </ResponsiveGrid>
      {extras.message && <AppText accessibilityLiveRegion="polite">{extras.message}</AppText>}
      {settings.message && <AppText>{settings.message}</AppText>}
    </ScreenContainer>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  input: { minHeight: 100, borderRadius: 12, borderWidth: 1, padding: 12, fontSize: 16 },
});
