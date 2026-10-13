// app/(tabs)/scanner.tsx — Ruta fina que entrega props tipadas a la página.
import { ScannerPage } from '@/pages/ScannerPage';
export default function ScannerRoute() {
  return (
    <ScannerPage
      title="Lector de códigos"
      subtitle="QR y códigos de barras, sin lecturas repetidas."
    />
  );
}
