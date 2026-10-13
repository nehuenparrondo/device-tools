// src/components/molecules/PermissionGate.tsx — Explica permisos y ofrece acceso a configuración.
import type { ReactNode } from 'react';
import { AppButton } from '@/components/atoms/AppButton';
import { AppText } from '@/components/atoms/AppText';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { openSettings } from '@/services/linkService';
import { Card } from './Card';
interface Props {
  granted: boolean;
  canAskAgain: boolean;
  permissionName: string;
  request(): Promise<unknown>;
  children: ReactNode;
}
export function PermissionGate({ granted, canAskAgain, permissionName, request, children }: Props) {
  const action = useAsyncAction();
  if (granted) return <>{children}</>;
  return (
    <Card>
      <AppText variant="subtitle">Permiso de {permissionName}</AppText>
      <AppText muted>
        Para usar esta herramienta necesitás autorizar el acceso. Si lo denegaste, podés habilitarlo
        en Configuración.
      </AppText>
      <AppButton
        label={canAskAgain ? 'Conceder permiso' : 'Abrir configuración'}
        busy={action.busy}
        onPress={() =>
          void action.run(async () => {
            if (canAskAgain) await request();
            else await openSettings();
          })
        }
      />
      {action.message && <AppText accessibilityLiveRegion="polite">{action.message}</AppText>}
    </Card>
  );
}
