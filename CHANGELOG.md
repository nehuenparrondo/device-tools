# CHANGELOG

El proyecto utiliza SemVer: MAJOR para cambios incompatibles, MINOR para funcionalidades compatibles y PATCH para correcciones.

## [1.0.1] - 2026-10-13

### Corregido

- Cambio frontal/trasera con montaje nuevo y eventos de cámara asociados a su sesión; ya no queda bloqueada la captura esperando un evento que no vuelve a emitirse.
- Reintento de cámara, descarte de respuestas antiguas, captura con timeout y validación de dimensiones/URI.
- Detección real de Expo Go mediante isRunningInExpoGo; una compilación de desarrollo propia no se confunde con Expo Go.
- Código seguro de iOS como alternativa explícita al Face ID no soportado por Expo Go, sin acceso libre al historial ni falsa afirmación de biometría.
- Permisos iOS durante inactive conservados; segundo plano y pérdida de foco detienen hardware y bloquean historial.
- Límites de espera GPS/geocodificación, restauración de brillo tardío, cancelación de importaciones y voz al salir, y bloqueo de resets durante guardado.
- Advertencia web de pointerEvents eliminada y cinco parches compatibles de Expo aplicados.

### Cambiado

- Nueva identidad visual marfil/grafito/petróleo/cobre, panel de inicio destacado, estados diferenciados y splash coordinado.
- 35 pruebas automatizadas, incluyendo contraste AA 4.5:1 de los pares de texto comprobados.
- APK preview con incremento de versionCode para actualizar sin borrar los datos existentes.

### Verificado

- TypeScript, lint, formato, 35 pruebas y Expo Doctor 21/21.
- El usuario confirmó fotos tras cambiar de cámara y verificación con código en su iPhone con Expo Go.
- Face ID real y prueba completa del APK Android continúan siendo comprobaciones físicas distintas.

## Documentación de publicación - 2026-10-12

- Repositorio GitHub público de entrega: nehuenparrondo/device-tools.
- README con enlaces al código, APK ARM64 y compilación EAS.
- Exclusiones de secretos y archivos de firma ampliadas para publicar sin credenciales.
- Revalidación de código aprobada; los parches Expo recomendados se documentan sin alterar las versiones del APK existente.

## [1.0.0] - 2026-10-07

### Agregado

- Proyecto Expo SDK 57 + React Native + Expo Router + TypeScript strict.
- Dashboard, cámara/linterna, lector QR/barras, GPS, sensores, biometría e historial.
- Tema persistente y controles flotantes de tema/scroll compartidos.
- Diseño adaptable, safe areas, áreas táctiles accesibles y navegación desplazable.
- SQLite local normalizado, dos migraciones, transacciones, etiquetas y filtros.
- Extras: galería, batería, red, información del dispositivo, háptica, brillo y voz.
- Validaciones y trece pruebas automatizadas de datos/SQL.
- README, documentación de componentes, normalización, defensa y pruebas manuales.
- Configuración EAS development, preview APK y production AAB.

### Estado de entrega

- Fuente y configuración disponibles; comprobaciones locales documentadas.
- Proyecto EAS real vinculado y firma Android administrada por EAS.
- APK ARM64 del perfil preview compilado correctamente; build EAS 072fd548-9e37-4714-b2d8-9bde716794d4 en estado FINISHED.
- APK ARM64 generado; repositorio GitHub de entrega documentado. Instalación, pruebas físicas y capturas del teléfono siguen pendientes.
