// src/components/atoms/StatusBadge.tsx — Estado legible sin depender exclusivamente del color.
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import type { Availability } from '@/types/components';
import { AppText } from './AppText';
const LABELS = {
  available: 'Disponible',
  limited: 'Disponible con código',
  pending: 'Permiso pendiente',
  unavailable: 'No disponible',
  error: 'Error',
} as const;
export function StatusBadge({ status }: { status: Availability }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.badge, { backgroundColor: colors.raised }]}>
      <AppText
        variant="small"
        style={{
          color:
            status === 'available'
              ? colors.primary
              : status === 'limited'
                ? colors.accent
                : status === 'pending'
                  ? colors.warning
                  : status === 'error'
                    ? colors.danger
                    : colors.muted,
        }}
      >
        {LABELS[status]}
      </AppText>
    </View>
  );
}
const styles = StyleSheet.create({
  badge: { alignSelf: 'flex-start', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4 },
});
