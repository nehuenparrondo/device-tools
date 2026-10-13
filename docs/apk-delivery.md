# Compilación e instalación de entrega

## Identificación

- Aplicación: Device Tools 1.0.0.
- Package Android: `com.nehuenparrondo.devicetools`.
- Proyecto EAS: `@elpepoestangod/device-tools`.
- Project ID: `0241fee7-3bb9-4aff-be17-68aa6229278b`.
- Build ID del reintento ARM64: `072fd548-9e37-4714-b2d8-9bde716794d4`.
- Perfil: `preview`, distribución interna y formato APK.
- Android versionCode: `1`.
- Firma: clave Android generada y administrada por EAS; no se exportó al repositorio.

[Consultar la compilación ARM64 en EAS](https://expo.dev/accounts/elpepoestangod/projects/device-tools/builds/072fd548-9e37-4714-b2d8-9bde716794d4).

Resultado del reintento: **FINISHED**, finalizado el 7 de octubre de 2026 a las 22:57:16 UTC. EAS generó el APK firmado con la misma clave Android del proyecto.

[Descargar APK Device Tools 1.0.0 ARM64](https://expo.dev/artifacts/eas/yb2ArRcBKyXg7VUj2FsK5N044nMezjTCuau3rqCy1G8.apk).

La copia local fue descargada y abierta correctamente como archivo APK: contiene manifiesto, recursos, DEX, bundle JavaScript y bibliotecas únicamente para `arm64-v8a`. Tamaño: 55356558 bytes (aproximadamente 52,8 MiB). SHA-256:

```text
C235EE7BEC1998426F1F7D0CFA67904FDB29F1E76E157D930A6A76940F0D9535
```

Esta inspección confirma estructura y huella de la copia descargada; no sustituye la instalación ni una verificación criptográfica independiente de la firma Android.

El [primer intento](https://expo.dev/accounts/elpepoestangod/projects/device-tools/builds/03ed695d-cf55-49ed-8395-dd8de7a431bd) fue cancelado después de 45 minutos de ejecución, sin generar APK. La entrega corresponde exclusivamente al reintento ARM64 terminado; no al build cancelado.

El APK de `preview` está destinado a celulares Android ARM64. No es compatible con teléfonos de 32 bits ni emuladores x86/x86_64. Los otros perfiles conservan las arquitecturas predeterminadas.

## Instalar en un teléfono Android

1. Abrir el enlace del build en el teléfono y comprobar que figura terminado.
2. Descargar el archivo APK de esta compilación.
3. Permitir temporalmente que el navegador o gestor de archivos instale aplicaciones de esta fuente.
4. Abrir el APK e instalar Device Tools. Desactivar luego ese permiso de instalación si no se necesita.
5. Abrir la app; este APK de prueba no necesita el servidor de desarrollo ni Expo Go.

No desinstalar una versión anterior para comprobar migraciones: la desinstalación borra los datos. Una actualización con el mismo package y firma debe conservarlos.

## Comprobaciones físicas imprescindibles

- Tema: cambiarlo, cerrar la app y comprobar que la preferencia permanece.
- Cámara: conceder el permiso al usarla, capturar, guardar en historial y exportar a galería.
- Escáner: leer QR y barras; comprobar el bloqueo de repetición y la confirmación antes de abrir URL.
- GPS: obtener ubicación, iniciar/detener seguimiento y guardar un punto.
- Sensores: activar los disponibles, cambiar intervalo y salir de la pantalla para comprobar cleanup.
- Biometría: verificar identidad y acceso al historial; probar cancelación y huella no registrada.
- Historial: revisar fotos/códigos/ubicaciones, filtros y eliminación confirmada.
- Persistencia: cerrar y volver a abrir sin Internet; los registros deben seguir disponibles.
- Permisos: denegar una solicitud y comprobar el mensaje y la recuperación desde Configuración.
- Orientación: girar el teléfono y revisar controles, tema y scroll.

Para aprobar la entrega, registrar los resultados completos de `docs/manual-testing.md` y capturas reales. Si el teléfono no tiene un sensor, registrar "no disponible", no simular que se probó.

## Revisión del estado desde la PC

```powershell
cd "C:\Users\parro\OneDrive\Desktop\react-native-tps\device-tools"
npx eas-cli@latest build:view 072fd548-9e37-4714-b2d8-9bde716794d4
```

El APK generado y su prueba física son pasos distintos. No se marcará instalación/hardware como aprobado sin haberlo realizado.
