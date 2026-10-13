# Preparación y generación del APK con EAS

eas.json ya define development, preview y production. app.json contiene nombre Device Tools, slug device-tools, versión 1.0.0, package com.nehuenparrondo.devicetools, ícono, splash, orientación, permisos y plugins.

La preparación local y la generación nativa no equivalen a un APK. No se debe marcar APK como entregado hasta descargarlo e instalarlo. La [guía oficial de Expo](https://docs.expo.dev/build-reference/apk/) explica los perfiles APK.

## 1. Cuenta y CLI

Crear una cuenta desde expo.dev si no se tiene. No es necesario instalar EAS globalmente:

```powershell
cd "C:\Users\parro\OneDrive\Desktop\react-native-tps\device-tools"
npx eas-cli@latest login
npx eas-cli@latest whoami
```

Si ya hay una sesión correcta, omitir login. No guardar contraseña ni token en el proyecto.

## 2. Vincular proyecto y firma

```powershell
npx eas-cli@latest build:configure -p android
```

EAS pedirá crear/vincular el proyecto a la cuenta elegida. Aceptar el identificador real generado; no inventar extra.eas.projectId. Mantener el perfil preview existente. Si pregunta por una clave Android, EAS puede generarla y administrarla. No compartirla públicamente.

El package Android debe ser único y no cambiarse después de publicar builds firmados. Para este proyecto es com.nehuenparrondo.devicetools.

## 3. Revisiones antes del build

```powershell
npm run check
npx expo install --check
npx expo export --platform android --output-dir dist/android
```

Revisar también el plan manual en un teléfono. Si hay que ajustar permisos/plugins, recompilar el binario. Las carpetas android/ios generadas están ignoradas: EAS las reconstruye desde app.json.

## 4. Build APK de prueba

```powershell
npx eas-cli@latest build -p android --profile preview
```

O `npm run build:apk`.

El perfil utiliza distribution: internal y android.buildType: apk. Seguir el enlace del proceso en expo.dev, revisar logs y esperar estado Finished. La espera depende de la cola y el plan de la cuenta; no hay un tiempo fijo garantizado.

El perfil `preview` limita la compilación a `arm64-v8a` mediante el argumento Gradle `-PreactNativeArchitectures=arm64-v8a`. Este APK está destinado a celulares Android ARM64; no sirve para teléfonos de 32 bits ni emuladores x86/x86_64. Los perfiles `development` y `production` mantienen la selección predeterminada de arquitecturas.

La primera compilación para las cuatro arquitecturas fue cancelada después de 45 minutos, sin APK. Se redujo el trabajo nativo del perfil de entrega; no se deshabilitó ninguna herramienta de la app. React Native documenta cómo [seleccionar arquitecturas para reducir el tiempo de compilación](https://reactnative.dev/docs/build-speed). EAS [cancela compilaciones que superan el máximo de duración del plan](https://docs.expo.dev/build-reference/limitations/); la cancelación observada es compatible con ese límite, aunque la API no devolvió un motivo explícito.

```powershell
npx eas-cli@latest build:list -p android --limit 5
```

No confundir una solicitud en cola con un APK generado.

## 5. Descargar e instalar

1. Abrir el enlace o QR del build terminado en el teléfono.
2. Descargar el .apk desde la página de detalles.
3. Autorizar temporalmente Instalar apps desconocidas para ese navegador/gestor.
4. Abrir el archivo e instalar Device Tools.
5. Revocar esa autorización si no se vuelve a necesitar.
6. Abrir la app y probar permisos, fotos, QR, GPS, sensores, biometría e historial.
7. Cerrar/reabrir sin Internet para comprobar persistencia.

Alternativa con Android Debug Bridge:

```powershell
adb install .\device-tools.apk
```

Actualizar con la misma firma conserva datos. Desinstalar los borra; no usar una desinstalación para probar migraciones.

## 6. Development build

expo-dev-client ya está instalado.

```powershell
npx eas-cli@latest build -p android --profile development
npm run start:dev
```

Instalar el APK de desarrollo terminado y conectarlo a Metro para depurar. Si cambia una librería nativa o un plugin, generar otro development build. Expo Go y development build son ejecutables distintos.

## 7. AAB de producción

```powershell
npx eas-cli@latest build -p android --profile production
```

production genera Android App Bundle (AAB) y aumenta la versión nativa. Un AAB no se instala directamente como APK; se usa para Google Play. Publicar en Play requiere cuenta de desarrollador y completar requisitos de la tienda; no forma parte del TP local.

## Problemas frecuentes

| Problema                                  | Acción                                                                     |
| ----------------------------------------- | -------------------------------------------------------------------------- |
| Dependencias incompatibles                | expo install --check, luego --fix y repetir check                          |
| ProjectId o cuenta incorrectos            | whoami, verificar proyecto vinculado y no reutilizar ID de otro TP         |
| Package inválido                          | Revisar segmentos del package en app.json                                  |
| Permisos/plugins faltantes                | Corregir configuración y recompilar, no solo recargar JavaScript           |
| App se cierra al abrir                    | Consultar logs del build/dispositivo, verificar módulo nativo y permisos   |
| Build en cola                             | Revisar estado y límites de cuenta; no iniciar duplicados                  |
| Firma distinta al instalar actualización  | Usar la misma clave; desinstalar solo con conocimiento de pérdida de datos |
| Archivo AAB que no instala                | Generar preview APK                                                        |
| Expo Go incompatible                      | Usar Go del SDK correspondiente o development build                        |
| Fallo de caché tras corregir dependencias | eas build -p android --profile preview --clear-cache                       |

## Entrega

Publicar el APK firmado en GitHub Releases o entregar el enlace EAS. Adjuntar README, capturas reales, registro de pruebas y versión. La URL y el archivo deben corresponder al build Finished que se instaló y probó.
