// src/components/molecules/ToolCard.tsx — Tarjeta de herramienta con icono, estado y acceso.
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '@/components/atoms/AppButton';
import { AppText } from '@/components/atoms/AppText';
import { StatusBadge } from '@/components/atoms/StatusBadge';
import type { ToolDefinition } from '@/constants/tools';
import { useTheme } from '@/hooks/useTheme';
import type { Availability } from '@/types/components';
import { Card } from './Card';
export function ToolCard({
  tool,
  status,
  onOpen,
}: {
  tool: ToolDefinition;
  status: Availability;
  onOpen(): void;
}) {
  const { colors } = useTheme();
  return (
    <Card style={{ flex: 1 }}>
      <Ionicons name={tool.icon} size={30} color={colors.primary} />
      <AppText variant="subtitle">{tool.title}</AppText>
      <AppText muted>{tool.description}</AppText>
      <StatusBadge status={status} />
      <AppButton label={`Abrir ${tool.shortTitle}`} secondary onPress={onOpen} />
    </Card>
  );
}
