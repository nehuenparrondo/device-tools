// app/(tabs)/camera.tsx — Ruta fina que entrega props tipadas a la página.
import { CameraPage } from '@/pages/CameraPage';
export default function CameraRoute() {
  return <CameraPage title="Cámara" subtitle="Capturá fotos y guardá tus momentos." />;
}
