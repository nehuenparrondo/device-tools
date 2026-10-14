# Compilación e instalación de entrega

## Versión actual: 1.0.1

Incluye las correcciones de cámara/identidad/permisos y la nueva paleta. [Compilación final 1.0.1 en EAS](https://expo.dev/accounts/elpepoestangod/projects/device-tools/builds/2c97b3cf-e653-4f9c-a8c3-2379e39d5a42), Android versionCode 3, perfil preview ARM64. Estado **FINISHED**, completada el 14 de octubre de 2026 a las 01:42:29 UTC (13 de octubre, 22:42:29 en UTC−3). El intento intermedio `b45ac979-22ff-407d-b54a-e1a009365533` fue cancelado para incorporar la paleta solicitada, no por un error de compilación.

[Descargar APK Device Tools 1.0.1 ARM64](https://expo.dev/artifacts/eas/L7XM7-Nj4r4iCmCYPZzredZihsBbsgmw9x3wS4MGh20.apk).

La copia descargada contiene manifiesto, recursos, DEX, bundle JavaScript y bibliotecas únicamente para `arm64-v8a`. Tamaño: 55365454 bytes. SHA-256:

```text
03804A1AA15D4D9A2EACE28AD7463B9FCFFA8522B12FEE9E2C38DEA0535EA938
```

Esta comprobación de estructura e integridad no sustituye la instalación en Android ni una verificación criptográfica independiente de la firma. EAS informa expiración del artefacto el 28 de octubre de 2026 a las 01:33:13 UTC; conservar la copia local. La prueba física Android sigue pendiente.

**No entregar el APK 1.0.0 como si contuviera estas correcciones.** Los datos del apartado siguiente se conservan solo como referencia histórica.

## Referencia histórica: identificación 1.0.0

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
npx eas-cli@latest build:view 2c97b3cf-e653-4f9c-a8c3-2379e39d5a42
```

El APK generado y su prueba física son pasos distintos. No se marcará instalación/hardware como aprobado sin haberlo realizado.
