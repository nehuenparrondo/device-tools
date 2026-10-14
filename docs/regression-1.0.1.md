# Device Tools 1.0.1: correcciones y pruebas

Fecha local: 13 de octubre de 2026.

## Fallos corregidos

1. La cámara ponía ready=false al cambiar facing sobre el mismo visor. En iOS no se garantiza un nuevo onCameraReady para ese cambio. Ahora se crea un montaje identificado por sesión/facing, se descartan eventos de sesiones antiguas y existen reintentos/timeout para no dejar bloqueada la captura.
2. Expo Go no incorpora Face ID. La app confundía hardware presente con disponibilidad en ese contenedor y solicitaba una autenticación imposible. Ahora usa el detector oficial de Expo Go y ofrece el código del sistema, sin prometer Face ID ni desbloquear sin autenticar. Una compilación propia conserva biometría.
3. Los diálogos iOS podían poner la app en inactive y cancelar solicitudes de GPS/movimiento. Ese estado se admite durante solicitudes del sistema; background y pérdida de foco siguen cancelando sesiones.
4. Se revisaron respuestas tardías: captura, importación de galería, brillo, voz y desmontaje de acciones asíncronas.
5. Se eliminaron props pointerEvents deprecadas y se aplicaron los cinco parches compatibles de Expo.

## Diseño

Paleta marfil, grafito, verde petróleo y cobre. Ambos temas comparten tokens y un panel destacado; splash y colores nativos están coordinados. Las pruebas comprueban contraste mínimo 4.5:1 para los pares principales de texto, botones, estados y panel destacado. No se afirma que un test de colores equivalga a una auditoría completa de accesibilidad.

## Comprobaciones locales

- TypeScript: aprobado.
- ESLint: sin errores ni advertencias.
- Prettier: aprobado.
- Pruebas automatizadas: 35 aprobadas.
- Compatibilidad de dependencias: aprobada.
- Expo Doctor: 21/21.
- Introspección nativa: permisos iOS de cámara, GPS y Face ID presentes; Android CAMERA presente, micrófono y ubicación en segundo plano bloqueados.
- Exportación Android, iOS y web: aprobada también con la nueva paleta y todos los cambios finales de código.
- Nueve rutas web: abren; consola sin errores/advertencias en la revisión realizada.
- Responsive: 390×844, 844×390 y 1440×900 sin desborde horizontal; grillas de una, dos y tres columnas.
- Tema: cambio y persistencia comprobados después de la hidratación de AsyncStorage.
- Scroll: botón visible tras desplazarse y retorno al inicio comprobado.

## Prueba física informada por el usuario

En este chat el usuario respondió "Funcionan las fotos y la verificación" al solicitar prueba de frontal/trasera, nueva captura y verificación con código en Expo Go iPhone 1.0.1. Se registra como confirmación del usuario, no como prueba ejecutada remotamente por el asistente. No informó modelo, versión de iOS ni repeticiones; no se inventan.

En una segunda comprobación respondió "Todo eso funciona" al pedir guardar una foto y un QR en Historial, obtener GPS, activar sensores y cerrar/reabrir para comprobar persistencia. Se registran también esos casos como prueba informada por el usuario en iPhone. No demuestra sensores ausentes, precisión absoluta del GPS, denegación de permisos ni el funcionamiento de un APK Android.

Face ID real no se verificó y no funciona en Expo Go. El código del sistema es una alternativa explícita, no biometría simulada. [Limitación oficial y fallback de iOS](https://docs.expo.dev/versions/v57.0.0/sdk/local-authentication/).

## APK final

La compilación EAS `2c97b3cf-e653-4f9c-a8c3-2379e39d5a42` terminó correctamente: versión 1.0.1, versionCode 3, perfil preview ARM64. Se descargó y comprobó su estructura y SHA-256. El enlace y la huella están en [la guía del APK](apk-delivery.md). Compilar y descargar no equivale a instalar y probar hardware Android.

## Pendientes y límites

- Instalar el APK final con nueva paleta y completar la prueba física en Android ARM64.
- Completar los casos restantes de `manual-testing.md`, especialmente galería, brillo, voz, permisos denegados y cancelación de autenticación. Repetir en Android los casos ya informados como correctos en iPhone.
- npm audit mantiene 29 avisos transitivos (11 moderados y 18 altos). No se aplicaron degradaciones forzadas ni se afirma que la auditoría esté limpia.
- Algunas herramientas transitivas conservan avisos de peer dependency para ESLint; el lint real sí aprueba.
- No es posible garantizar ausencia de todos los errores posibles. Los tests de políticas/sesiones no sustituyen hardware real ni la validación del APK instalado.
- El usuario autorizó expresamente actualizar el repositorio público con esta revisión. Se publican código, informes y capturas web, sin credenciales ni datos personales del dispositivo.
