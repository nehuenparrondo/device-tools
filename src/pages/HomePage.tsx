// src/pages/HomePage.tsx — Panel responsive con estados reales de las herramientas.
import { useRouter } from 'expo-router';
import { AppText } from '@/components/atoms/AppText';
import { Card } from '@/components/molecules/Card';
import { ToolCard } from '@/components/molecules/ToolCard';
import { StatePanel } from '@/components/molecules/StatePanel';
import { ResponsiveGrid } from '@/components/organisms/ResponsiveGrid';
import { ScreenContainer } from '@/components/organisms/ScreenContainer';
import { TOOLS } from '@/constants/tools';
import { useDatabase } from '@/context/DatabaseContext';
import { useCapabilities } from '@/hooks/useCapabilities';
import type { PageProps } from '@/types/components';
export function HomePage(props: PageProps) {
  const availability = useCapabilities();
  const router = useRouter();
  const database = useDatabase();
  return (
    <ScreenContainer {...props}>
      <Card>
        <AppText variant="title">Descubrí lo que tu teléfono puede hacer.</AppText>
        <AppText muted>
          Explorá, capturá y guardá. Tus registros se conservan en este dispositivo y funcionan sin
          conexión.
        </AppText>
        <AppText variant="small">8 herramientas · guardado local · permisos a tu control</AppText>
      </Card>
      {database.error && (
        <StatePanel
          title="No se pudo preparar el historial"
          message={database.error}
          action={database.retry}
        />
      )}
      <ResponsiveGrid>
        {TOOLS.filter((tool) => tool.key !== 'index').map((tool) => (
          <ToolCard
            key={tool.key}
            tool={tool}
            status={availability[tool.key] ?? 'pending'}
            onOpen={() => router.push(tool.route)}
          />
        ))}
      </ResponsiveGrid>
    </ScreenContainer>
  );
}
