// app/(tabs)/location.tsx — Ruta fina que entrega props tipadas a la página.
import { LocationPage } from '@/pages/LocationPage';
export default function LocationRoute() {
  return (
    <LocationPage title="Ubicación / GPS" subtitle="Tu posición y recorrido en tiempo real." />
  );
}
