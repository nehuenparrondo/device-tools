# Informe de verificación

**Actualización 1.0.1 del 13/10/2026:** consultar [regression-1.0.1.md](regression-1.0.1.md). Se aplicaron los cinco parches, se corrigieron cámara/autenticación y aprobaron 35 pruebas y Expo Doctor 21/21. El usuario confirmó las fotos y el código de iOS. Los apartados siguientes conservan el historial de 1.0.0 y no describen el estado actual de dependencias.

Fecha: 7 de octubre de 2026. Proyecto: Device Tools 1.0.0.

## Controles locales aprobados

| Control                                | Resultado                         |
| -------------------------------------- | --------------------------------- |
| TypeScript estricto                    | Sin errores                       |
| ESLint                                 | Sin errores ni advertencias       |
| Prettier                               | Formato verificado                |
| Pruebas automatizadas                  | 13 aprobadas                      |
| Compatibilidad de dependencias Expo    | Versiones compatibles             |
| Expo Doctor                            | 21 de 21 comprobaciones aprobadas |
| Exportación Android                    | Bundle generado correctamente     |
| Exportación web                        | Bundle generado correctamente     |
| Generación del proyecto nativo Android | Prebuild completado               |

Las pruebas ejecutan el esquema, migraciones, seed y consultas con SQLite. Comprueban restricciones, claves foráneas, borrado en cascada, transacciones y validaciones. También verifican que el helper de transacciones active las claves foráneas antes de comenzar la transacción y revierta una escritura fallida.

El prebuild permite revisar el manifiesto y la configuración nativa, pero no sustituye una compilación Gradle ni demuestra que exista un APK.

## Revisión visual en navegador

La compilación nativa EAS `072fd548-9e37-4714-b2d8-9bde716794d4` también terminó correctamente y generó un APK firmado ARM64. El build inicial para todas las arquitecturas fue cancelado; el resultado aprobado es el reintento documentado en `docs/apk-delivery.md`. Instalar y probar el archivo en un celular sigue siendo una comprobación separada y pendiente.

- Las nueve rutas abren sin errores ni advertencias en la consola de la revisión final.
- Tema claro y oscuro; selección conservada después de recargar.
- Grillas de una, dos y tres columnas en teléfono, orientación horizontal y escritorio.
- Botón de regreso al inicio del scroll probado.
- Funciones nativas no disponibles en web muestran mensajes en lugar de fallar.
- Capturas de tablet en `docs/screenshots/web-tablet-clara.jpg` y `docs/screenshots/web-tablet-oscura.jpg`.

Esta revisión utiliza un navegador. No equivale a una prueba de cámara, GPS, sensores, biometría o SQLite en un teléfono real.

## Pendientes de entrega física

1. Instalar el APK ARM64 firmado del perfil `preview` en un celular compatible.
2. Completar `docs/manual-testing.md`, incluyendo permisos denegados, reinicio, orientación y segundo plano.
3. Guardar capturas reales sin información personal.
4. Publicar una Release cuando corresponda, una vez comprobado el APK en el teléfono.

Se vinculó el proyecto EAS real y se completó la compilación remota de entrega. El estado y los enlaces se registran en `docs/apk-delivery.md`. El repositorio público de entrega es [nehuenparrondo/device-tools](https://github.com/nehuenparrondo/device-tools); no se realizó una prueba física. La configuración y las instrucciones están preparadas en `docs/eas-build.md`.

## Revalidación para GitHub: 12 de octubre de 2026

TypeScript, ESLint sin advertencias, Prettier y las 13 pruebas automatizadas volvieron a aprobarse. La comprobación de compatibilidad Expo ahora recomienda cinco parches publicados desde la revisión original:

- expo: 57.0.27 → ~57.0.28.
- expo-dev-client: 57.0.19 → ~57.0.20.
- expo-location: 57.0.20 → ~57.0.21.
- expo-router: 57.0.25 → ~57.0.26.
- expo-splash-screen: 57.0.9 → ~57.0.10.

Por este motivo `npm run check` ya no termina completamente en verde: se detiene en `expo install --check`. Expo Doctor se ejecutó también por separado y aprobó 20 de 21 comprobaciones; la restante señala esos cinco parches. No se modificaron las versiones durante la publicación para mantener la correspondencia con el APK compilado. Una actualización requiere repetir verificaciones y generar otro APK. Los resultados 21/21 anteriores corresponden al 7 de octubre, no a esta revalidación.

## Advertencias conocidas de dependencias

La auditoría de npm sigue informando 29 avisos en dependencias transitivas: 11 moderados y 18 altos. Se aplicaron correcciones compatibles; no se utilizaron actualizaciones forzadas que cambien Expo o React Native por versiones incompatibles. No se afirma que la auditoría esté limpia.

Algunos plugins transitivos declaran compatibilidad con ESLint anterior y generan avisos de peer dependencies durante la instalación. El adaptador oficial `@eslint/compat` permite ejecutar la configuración; el lint real termina sin advertencias.

Durante la compilación Android se observaron advertencias de APIs deprecadas dentro de dependencias nativas, por ejemplo `react-native-safe-area-context`; no son errores del código TypeScript de la app. No se ocultaron ni se modificaron dependencias instaladas para silenciarlas.

La ausencia de advertencias de ejecución nativa debe comprobarse en el APK instalado. Los resultados locales no justifican prometer compatibilidad con cualquier dispositivo.

## Repetir verificaciones

```powershell
cd "C:\Users\parro\OneDrive\Desktop\react-native-tps\device-tools"
npm run check
npx expo export --platform android --platform web
```

Para comprobar hardware, seguir el procedimiento de prueba física antes de considerar la entrega finalizada.
