// src/constants/tools.ts — Catálogo extensible de herramientas y rutas.
import type { IconName } from '@/components/atoms/IconButton';
export interface ToolDefinition {
  key: string;
  route:
    | '/'
    | '/camera'
    | '/scanner'
    | '/location'
    | '/sensors'
    | '/biometrics'
    | '/history'
    | '/extras'
    | '/about';
  title: string;
  shortTitle: string;
  description: string;
  icon: IconName;
}
export const TOOLS: ToolDefinition[] = [
  {
    key: 'index',
    route: '/',
    title: 'Inicio',
    shortTitle: 'Inicio',
    description: 'Tu panel de herramientas.',
    icon: 'grid-outline',
  },
  {
    key: 'camera',
    route: '/camera',
    title: 'Cámara',
    shortTitle: 'Cámara',
    description: 'Capturá fotos, cambiá de cámara y encendé la linterna.',
    icon: 'camera-outline',
  },
  {
    key: 'scanner',
    route: '/scanner',
    title: 'Lector de códigos',
    shortTitle: 'Códigos',
    description: 'Explorá QR y códigos de barras, copiá o guardá sus datos.',
    icon: 'scan-outline',
  },
  {
    key: 'location',
    route: '/location',
    title: 'Ubicación / GPS',
    shortTitle: 'GPS',
    description: 'Consultá tu ubicación, seguí el recorrido y guardá puntos.',
    icon: 'navigate-outline',
  },
  {
    key: 'sensors',
    route: '/sensors',
    title: 'Sensores',
    shortTitle: 'Sensores',
    description: 'Mirá el movimiento, el campo magnético, la presión y los pasos.',
    icon: 'pulse-outline',
  },
  {
    key: 'biometrics',
    route: '/biometrics',
    title: 'Biometría',
    shortTitle: 'Identidad',
    description: 'Verificá tu identidad con la protección del dispositivo.',
    icon: 'finger-print-outline',
  },
  {
    key: 'history',
    route: '/history',
    title: 'Historial',
    shortTitle: 'Historial',
    description: 'Tus fotos, códigos y puntos GPS, guardados en este teléfono.',
    icon: 'time-outline',
  },
  {
    key: 'extras',
    route: '/extras',
    title: 'Más herramientas',
    shortTitle: 'Extras',
    description: 'Batería, red, galería, brillo, voz y portapapeles.',
    icon: 'sparkles-outline',
  },
  {
    key: 'about',
    route: '/about',
    title: 'Acerca del proyecto',
    shortTitle: 'Acerca',
    description: 'Conocé las herramientas, los permisos y la privacidad.',
    icon: 'information-circle-outline',
  },
];
