// app/(tabs)/history.tsx — Ruta fina que entrega props tipadas a la página.
import { HistoryPage } from '@/pages/HistoryPage';
export default function HistoryRoute() {
  return <HistoryPage title="Historial" subtitle="Tus registros, organizados por fecha." />;
}
