// app/(tabs)/about.tsx — Ruta fina que entrega props tipadas a la página.
import { AboutPage } from '@/pages/AboutPage';
export default function AboutRoute() {
  return <AboutPage title="Acerca del proyecto" subtitle="Herramientas, permisos y privacidad." />;
}
