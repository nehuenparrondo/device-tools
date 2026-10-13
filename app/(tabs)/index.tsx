// app/(tabs)/index.tsx — Ruta fina que entrega props tipadas a la página.
import { HomePage } from '@/pages/HomePage';
export default function HomeRoute() {
  return <HomePage title="Inicio" subtitle="Explorá las herramientas de tu dispositivo." />;
}
