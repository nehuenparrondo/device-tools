// src/components/molecules/StatePanel.tsx — Estados vacío, error, espera y plataforma.
import { ActivityIndicator } from 'react-native';
import { AppText } from '@/components/atoms/AppText';
import { AppButton } from '@/components/atoms/AppButton';
import { useTheme } from '@/hooks/useTheme';
import { Card } from './Card';
export function StatePanel({
  title,
  message,
  loading = false,
  action,
  actionLabel = 'Reintentar',
}: {
  title: string;
  message: string;
  loading?: boolean;
  action?(): void;
  actionLabel?: string;
}) {
  const { colors } = useTheme();
  return (
    <Card>
      {loading && <ActivityIndicator color={colors.primary} />}
      <AppText variant="subtitle">{title}</AppText>
      <AppText muted>{message}</AppText>
      {action && <AppButton label={actionLabel} onPress={action} />}
    </Card>
  );
}
