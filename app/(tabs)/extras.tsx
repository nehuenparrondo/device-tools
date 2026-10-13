// app/(tabs)/extras.tsx — Ruta fina que entrega props tipadas a la página.
import { ExtrasPage } from '@/pages/ExtrasPage';
export default function ExtrasRoute() {
  return (
    <ExtrasPage title="Más herramientas" subtitle="Descubrí otras funciones de tu teléfono." />
  );
}
