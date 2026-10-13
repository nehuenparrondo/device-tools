// app/(tabs)/sensors.tsx — Ruta fina que entrega props tipadas a la página.
import { SensorsPage } from '@/pages/SensorsPage';
export default function SensorsRoute() {
  return <SensorsPage title="Sensores" subtitle="Mirá cómo reacciona tu teléfono al movimiento." />;
}
