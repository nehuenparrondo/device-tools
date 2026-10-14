// src/pages/AboutPage.tsx — Explica herramientas y privacidad en lenguaje de usuario.
import { AppText } from '@/components/atoms/AppText';
import { Card } from '@/components/molecules/Card';
import { ResponsiveGrid } from '@/components/organisms/ResponsiveGrid';
import { ScreenContainer } from '@/components/organisms/ScreenContainer';
import type { PageProps } from '@/types/components';
export function AboutPage(props: PageProps) {
  return (
    <ScreenContainer {...props}>
      <ResponsiveGrid>
        <Card>
          <AppText variant="subtitle">Device Tools · 1.0.1</AppText>
          <AppText>
            Un espacio para explorar las herramientas de tu teléfono y aprender cómo funcionan.
          </AppText>
          <AppText muted>
            Proyecto académico de Nehuén Parrondo. Expo + React Native + TypeScript.
          </AppText>
        </Card>
        <Card>
          <AppText variant="subtitle">Tus datos se quedan con vos</AppText>
          <AppText>
            Las fotografías, códigos y ubicaciones se guardan en este dispositivo. No se envían a un
            servidor.
          </AppText>
          <AppText muted>
            La dirección legible depende del servicio de geocodificación del sistema y puede usar
            Internet. Al abrir un enlace o mapa, compartís el dato correspondiente con otra
            aplicación.
          </AppText>
        </Card>
        <Card>
          <AppText variant="subtitle">Permisos a tu control</AppText>
          <AppText>
            La cámara, el GPS y la galería piden autorización cuando los usás. Podés revocarla desde
            Configuración.
          </AppText>
          <AppText muted>
            No se pide acceso al micrófono, ubicación en segundo plano ni modificación global del
            brillo de Android.
          </AppText>
        </Card>
        <Card>
          <AppText variant="subtitle">Protección del historial</AppText>
          <AppText>
            Si tenés huella o rostro configurados, se requiere una verificación para abrir el
            historial. Al salir, se vuelve a bloquear.
          </AppText>
          <AppText muted>
            Si no hay biometría disponible, se informa y se ofrece continuar manualmente. El bloqueo
            protege el acceso desde la interfaz; los archivos no están cifrados por esta app.
          </AppText>
        </Card>
        <Card>
          <AppText variant="subtitle">Sensores y disponibilidad</AppText>
          <AppText>
            Las herramientas se adaptan al hardware presente. Un emulador o un teléfono sin
            barómetro mostrarán que no está disponible.
          </AppText>
          <AppText muted>
            El GPS y la brújula son demostraciones educativas. La precisión puede variar.
          </AppText>
        </Card>
        <Card>
          <AppText variant="subtitle">Cómo usar la interfaz</AppText>
          <AppText>
            Deslizá las pestañas inferiores para ver todas las herramientas. Cambiá el tema con el
            botón flotante; el botón de arriba aparece al desplazarte por una pantalla.
          </AppText>
          <AppText muted>
            Probá girar tu teléfono o usar una tablet: las tarjetas y los visores se ajustan al
            espacio disponible.
          </AppText>
        </Card>
      </ResponsiveGrid>
    </ScreenContainer>
  );
}
