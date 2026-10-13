// app/(tabs)/biometrics.tsx — Ruta fina que entrega props tipadas a la página.
import { BiometricsPage } from '@/pages/BiometricsPage';
export default function BiometricsRoute() {
  return (
    <BiometricsPage title="Biometría" subtitle="La seguridad del dispositivo, a tu alcance." />
  );
}
