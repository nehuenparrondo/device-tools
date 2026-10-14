// src/pages/HistoryPage.tsx — Historial unificado con filtros y acceso explícito.
import { Platform, StyleSheet, View } from 'react-native';
import { AppButton } from '@/components/atoms/AppButton';
import { AppText } from '@/components/atoms/AppText';
import { Card } from '@/components/molecules/Card';
import { StatePanel } from '@/components/molecules/StatePanel';
import { HistoryList } from '@/components/organisms/HistoryList';
import { ScreenContainer } from '@/components/organisms/ScreenContainer';
import { useHistory } from '@/hooks/useHistory';
import type { PageProps } from '@/types/components';
import type { RecordKind } from '@/types/database';
const FILTERS: { label: string; value?: RecordKind }[] = [
  { label: 'Todos' },
  { label: 'Fotos', value: 'photo' },
  { label: 'Códigos', value: 'scan' },
  { label: 'GPS', value: 'location' },
];
export function HistoryPage(props: PageProps) {
  const history = useHistory();
  return (
    <ScreenContainer {...props}>
      {Platform.OS === 'web' ? (
        <StatePanel
          title="No disponible en esta plataforma"
          message="El historial SQLite permanece en el teléfono. Abrí la app desde el APK."
        />
      ) : history.database.error ? (
        <StatePanel
          title="Error de base de datos"
          message={history.database.error}
          action={history.database.retry}
        />
      ) : !history.database.ready ? (
        <StatePanel title="Preparando historial" message="Aplicando migraciones locales." loading />
      ) : !history.unlocked ? (
        history.biometrics.loading ? (
          <StatePanel
            title="Verificando protección"
            message="Comprobando biometría del dispositivo."
            loading
          />
        ) : history.biometrics.error ? (
          <StatePanel
            title="No se pudo comprobar la protección"
            message={history.biometrics.error}
            action={history.biometrics.refresh}
          />
        ) : (
          <Card>
            <AppText variant="subtitle">Tu historial es privado</AppText>
            <AppText muted>
              Contiene fotos y ubicaciones. Se vuelve a bloquear al salir de esta pantalla o pasar
              la app a segundo plano.
            </AppText>
            {history.biometrics.capability?.available ? (
              <>
                <AppText>{history.biometrics.capability.notice}</AppText>
                <AppButton
                  label={history.biometrics.capability.actionLabel}
                  busy={history.busy}
                  onPress={history.unlock}
                />
              </>
            ) : history.biometrics.capability?.canBypass ? (
              <>
                <AppText>
                  No hay biometría registrada. El dispositivo debe estar bajo tu control para
                  continuar.
                </AppText>
                <AppButton label="Continuar sin biometría" onPress={history.bypass} />
              </>
            ) : (
              <>
                <AppText>{history.biometrics.capability?.notice}</AppText>
                <AppButton label="Comprobar soporte" onPress={history.biometrics.refresh} />
              </>
            )}
          </Card>
        )
      ) : (
        <>
          <View style={styles.filters}>
            {FILTERS.map((filter) => (
              <AppButton
                key={filter.label}
                label={filter.label}
                secondary={history.filter !== filter.value}
                onPress={() => history.setFilter(filter.value)}
              />
            ))}
          </View>
          <AppButton label="Actualizar historial" secondary onPress={history.refresh} />
          {history.loading ? (
            <StatePanel
              title="Cargando registros"
              message="Leyendo la base de datos del dispositivo."
              loading
            />
          ) : history.error ? (
            <StatePanel
              title="No se pudo cargar el historial"
              message={history.error}
              action={history.refresh}
            />
          ) : history.records.length === 0 ? (
            <StatePanel
              title="Todavía no hay registros"
              message="Guardá una foto, un código o una ubicación; probá también cambiar el filtro."
            />
          ) : (
            <HistoryList records={history.records} onRemove={history.remove} busy={history.busy} />
          )}
        </>
      )}
      {history.message && <AppText accessibilityLiveRegion="polite">{history.message}</AppText>}
    </ScreenContainer>
  );
}
const styles = StyleSheet.create({ filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 } });
