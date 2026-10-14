# Plan de trabajo y checklist de la rúbrica

## Revisión 1.0.1 — 13/10/2026

- [x] Corregir cambio de cámara y eventos de sesiones anteriores.
- [x] Alternativa segura con código iOS en Expo Go, sin prometer Face ID.
- [x] Confirmación del usuario: fotografías y verificación con código funcionan en su iPhone.
- [x] Confirmación adicional del usuario: QR, GPS, sensores e historial persistente funcionan en su iPhone.
- [x] Nueva paleta marfil/grafito/petróleo/cobre, con contraste comprobado en ambos temas.
- [x] Cinco parches de Expo aplicados, 35 pruebas y Doctor 21/21.
- [x] Exportar Android, iOS y web con el código final.
- [x] Revisar las nueve rutas web, tema persistente, scroll y tamaños responsive.
- [x] APK final 1.0.1: EAS FINISHED, descargado, estructura ARM64 y SHA-256 comprobados.
- [ ] Instalar y completar pruebas físicas en Android ARM64.
- [x] Publicar las correcciones de 1.0.1 en GitHub, con autorización expresa del usuario.

Los checks históricos siguientes describen también el trabajo entregado en 1.0.0; no equivalen a validar hardware nuevo ni Face ID en Expo Go.

## Etapas

- [x] Leer consigna completa.
- [x] Crear carpeta propia y dependencias compatibles.
- [x] TypeScript estricto, ESLint y Prettier.
- [x] Tema persistente, scroll raíz y Atomic Design.
- [x] SQLite, normalización, migraciones y SQL de entrega.
- [x] Cámara y lector integrado.
- [x] GPS, sensores y biometría.
- [x] Historial y Extras.
- [x] README, CHANGELOG, componentes y defensa oral.
- [x] Pruebas automatizadas de validación y SQL.
- [x] Preparar configuración EAS/APK.
- [ ] Completar pruebas físicas y capturas.
- [x] Vincular proyecto EAS real y preparar firma Android.
- [x] Compilar APK firmado ARM64 con EAS, estado FINISHED.
- [x] Descargar APK e inspeccionar contenido, arquitectura y SHA-256.
- [ ] Instalar y comprobar APK.
- [x] Crear commit de entrega y publicar el código en GitHub público.
- [ ] Publicar una Release después de las pruebas físicas, si se requiere.

## Evidencia por parte de la consigna

| Parte | Rúbrica cubierta                                      | Evidencia                                                    |
| ----- | ----------------------------------------------------- | ------------------------------------------------------------ |
| 1     | Setup, herramientas y arquitectura                    | package.json, app.json, eas.json, tsconfig, README           |
| 2     | BD 1FN/2FN/3FN, ER, PK/FK/índices/consultas           | database/, schema.ts, database-normalization.md              |
| 3     | Usabilidad, tema/scroll, accesibilidad, Atomic Design | context/, components/, styles/, hooks/ y layouts             |
| 4     | Cámara, QR/barras, dashboard, permisos                | HomePage, CameraPage, ScannerPage y hooks/services           |
| 5     | GPS, movimiento, sensores y biometría                 | LocationPage, SensorsPage, BiometricsPage                    |
| 6     | Historial, filtros, borrado y extras                  | HistoryPage, ExtrasPage, AboutPage                           |
| 7     | APK/AAB y perfil preview                              | eas.json, eas-build.md y apk-delivery.md; APK ARM64 generado |
| 8     | Versionado, documentación y defensa                   | README, CHANGELOG, git-guide, manual-testing, oral-defense   |

## Checklist obligatorio

- [x] Proyecto propio React Native/Expo/TypeScript strict, sin any en el código de la app.
- [x] Rutas finas con props tipadas y componentes de una responsabilidad.
- [x] Cámara frontal/trasera, flash, linterna, captura, previsualización, historial y galería.
- [x] QR/barras, guía animada, bloqueo de repetición, copiar, URL confirmada y guardado.
- [x] GPS actual, seguimiento con parada, datos completos, dirección, mapa y persistencia.
- [x] Acelerómetro/giroscopio/magnetómetro, barras, intervalo, pelota y sacudida.
- [x] Barómetro/podómetro según disponibilidad, permisos y cleanup.
- [x] Biometría: hardware/inscripción/tipos, mensajes y protección del historial.
- [x] Historial unificado, filtros, fecha descendente, vacío, error y borrado confirmado.
- [x] Tema claro/oscuro persistente, botón flotante raíz y status bar/tabs adaptados.
- [x] Flecha de scroll animada compartida para pantallas desplazables.
- [x] Breakpoints, safe areas, orientación, grillas y controles accesibles.
- [x] Web con mensaje de plataforma para funciones nativas.
- [x] Modelo normalizado, SQL completo, seed ficticio, consultas y Mermaid.
- [x] Migraciones user_version, FK activas, CHECK/UNIQUE y parámetros.
- [x] Validación previa, privacidad, permisos mínimos y secretos ignorados.
- [x] Perfiles development, preview APK y production AAB.
- [x] Guías Git, SemVer, documentación de componentes, pruebas y defensa.
- [ ] Probar toda la funcionalidad nativa en dispositivo físico.
- [ ] Garantizar ausencia de warnings de ejecución en el APK mediante prueba real.
- [x] APK firmado ARM64 compilado con EAS.
- [x] APK descargado y disponible para entregar.
- [ ] APK instalado en un teléfono y probado.
- [x] Repositorio GitHub público con código, README y capturas web.
- [ ] Incorporar capturas reales de la app instalada.
- [x] Enlace EAS de build FINISHED verificado; véase apk-delivery.md.

## Estado honesto de verificaciones

Los resultados definitivos de los controles locales se registran en el informe de verificación. Un check marcado arriba significa implementación presente; no equivale a prueba física aprobada.

npm audit identifica avisos en dependencias transitivas del toolchain Expo (incluye braces, node-forge, uuid y decode-uri-component). Se aplicaron actualizaciones compatibles. No se forzaron degradaciones de Expo/React Native ni SDK beta para silenciar la auditoría. Es una limitación conocida del ecosistema que debe revisarse con nuevas versiones estables; no se afirma que npm audit esté limpio.

Algunas herramientas transitivas conservan metadatos de peer dependency para ESLint 9; el proyecto usa ESLint 10 con el adaptador oficial @eslint/compat, y valida el comando lint real. Esos avisos de instalación no se confunden con warnings de la aplicación.
