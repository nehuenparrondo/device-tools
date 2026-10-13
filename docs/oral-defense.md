# Guía para defender el proyecto

## ¿Qué hace la aplicación?

Explora APIs nativas del teléfono y permite guardar fotos, códigos y ubicaciones en un historial local. No necesita un servidor para funcionar offline.

## ¿Qué es un permiso en runtime?

Es la autorización solicitada durante el uso de una función. Declarar CAMERA en el manifiesto solo habilita que la app pueda solicitar acceso; no implica que el usuario ya lo concedió. Pedimos cada permiso al usar la herramienta y manejamos denegación.

## ¿Por qué hay plugins y app.json?

Los plugins generan configuración nativa como permisos Android y textos iOS. Cambiarlos exige recompilar el binario; un cambio JavaScript no modifica el manifiesto del APK instalado.

## ¿Cómo funciona la cámara?

CameraView muestra la vista previa. Esperamos onCameraReady antes de takePictureAsync. El resultado empieza en caché; antes de guardar copiamos el archivo a documentos privados. Solo una cámara está activa y se desmonta al cambiar de tab o pasar a segundo plano.

## ¿Cómo se evita duplicar un QR?

Un ref bloquea el primer evento válido de cada sesión y el visor se sustituye por el resultado. Solo el botón Escanear otro código desbloquea la lectura. Guardar está deshabilitado tras una escritura correcta.

## ¿Por qué confirmar los enlaces?

El contenido del QR no es confiable. Aceptamos solo HTTP/HTTPS sin credenciales y preguntamos antes de salir de la app. No ejecutamos javascript:, file: ni esquemas de otras apps.

## ¿Qué diferencia hay entre acelerómetro y giroscopio?

El acelerómetro mide aceleración en los ejes x/y/z, incluyendo gravedad; Expo la informa en g. El giroscopio mide velocidad angular alrededor de los ejes, en rad/s. Inclinación y rotación no son la misma medición.

## ¿Qué mide el magnetómetro?

Mide campo magnético en microteslas. La brújula calcula un ángulo orientativo del plano x/y; no compensa todas las inclinaciones ni interferencias y no reemplaza navegación real.

## ¿Qué mide el barómetro y el podómetro?

El barómetro mide presión en hPa y depende del hardware. El podómetro cuenta pasos estimados de la sesión activa; no se presenta como contador histórico del día ni mide en segundo plano.

## ¿Por qué limpiar suscripciones?

Cada listener consume recursos y entrega actualizaciones. Sin remove(), una pantalla inactiva seguiría recibiendo datos y al volver aparecerían listeners duplicados, consumo de batería y estados tardíos. Eliminamos solo nuestra suscripción, nunca todos los listeners del módulo.

## ¿Cómo se detecta una sacudida?

Calculamos la norma sqrt(x²+y²+z²) del acelerómetro. Un valor superior a 2.4 g y más de 1.5 segundos desde la última detección dispara vibración y suma un contador. Es una heurística simple, configurable y educativa.

## ¿Qué es GPS y qué precisión tiene?

Es posicionamiento basado en señales de satélites; el sistema puede combinar otras fuentes. No existe una precisión fija garantizada. El valor accuracy es la estimación horizontal en metros del sistema y depende de señal, edificios y permisos de ubicación aproximada. Mostramos también altitud, velocidad y rumbo si existen.

## ¿Qué es geocodificación inversa?

Convierte coordenadas en una dirección legible. Puede requerir conexión y proveedor del sistema. Si falla, las coordenadas siguen siendo válidas y guardables.

## ¿Dónde se guardan los datos biométricos?

Los gestiona el sistema operativo en sus mecanismos protegidos. La app no recibe ni guarda huellas o imágenes faciales; solo obtiene el resultado de authenticateAsync y consulta si hay hardware e inscripción.

## ¿Qué protege la biometría de esta app?

La lectura y visualización del historial desde la interfaz. Se vuelve a bloquear al salir o ir a segundo plano. No cifra SQLite ni los archivos. Sin biometría disponible existe una alternativa manual explicada; un fallo de comprobación no habilita ese acceso.

## ¿Cómo se maneja un diálogo biométrico en iOS?

El estado inactive temporal por un diálogo del sistema no debe confundirse con background. La sesión biométrica permite ese diálogo, pero cambio de ruta o segundo plano invalidan respuestas tardías.

## ¿Por qué TypeScript strict y una unión discriminada?

Strict obliga a representar valores nulos y contratos. kind distingue photo, scan y location, de modo que una foto siempre tiene uri/ancho/alto y una ubicación tiene coordenadas. No se usa any para ocultar errores.

## ¿Qué aporta Atomic Design?

Reutilizamos átomos como botones/texto, moléculas como tarjetas/permisos y organismos como visores/listas. Las páginas componen esos bloques y la lógica de hardware está en hooks/services. Un cambio de tema no necesita duplicar estilos en todas las pantallas.

## ¿Cómo funcionan el tema y el botón de scroll?

ThemeContext usa el sistema hasta que el usuario elige; AsyncStorage conserva la elección. ScrollContext registra el ScrollView de la pantalla enfocada y su offset. El layout anima la flecha solo sobre 240 px y llama scrollTo con animación sobre esa referencia.

## ¿Qué es SQLite y por qué no hay backend?

SQLite es un motor SQL embebido que guarda una base local en el dispositivo. Cumple el historial offline. No agregamos servidor ni MySQL porque no hay un requisito de sincronización multiusuario que lo justifique.

## ¿Qué es 1FN, 2FN y 3FN?

1FN: valores atómicos sin listas en una celda. 2FN: cada atributo depende de toda la clave, eliminando dependencias parciales de claves compuestas. 3FN: elimina dependencias transitivas entre atributos no clave. tools separa el catálogo, record_tags resuelve N:M y los detalles tienen PK/FK 1:1.

## ¿Qué garantiza una transacción?

O se guarda el registro, su detalle y etiquetas completos, o se revierte todo. Las migraciones también incrementan user_version dentro de una transacción para no registrar una versión cuyo SQL falló.

## ¿Para qué sirve PRAGMA foreign_keys?

Activa la integridad referencial de SQLite. ON DELETE CASCADE elimina detalles y relaciones cuando se borra su registro, sin dejar filas huérfanas.

## ¿Cómo se evita SQL Injection?

Nunca concatenamos entrada del usuario al SQL. Pasamos valores como parámetros ?. execAsync se reserva para SQL estático de migraciones y el número interno de versión.

## ¿Qué es EAS?

Expo Application Services incluye compilación remota, distribución y otros servicios. EAS Build compila el código nativo y firma el resultado. El bundle exportado por Metro es solo JavaScript y recursos, no un APK instalable.

## ¿APK o AAB?

APK es un paquete instalable para pruebas. AAB es un formato de distribución para Google Play; la tienda genera APKs optimizados para cada dispositivo. preview genera APK y production genera AAB.

## ¿Expo Go o development build?

Expo Go es una app contenedora con módulos y permisos ya incorporados. Un development build es nuestro propio binario con expo-dev-client y configuración nativa propia. preview es una app de prueba instalable que no necesita Metro para arrancar.

## ¿Qué se verificó y qué queda demostrar?

TypeScript, lint, formato, SQL/validaciones, compatibilidad Expo, exportación Android/web y generación de configuración nativa pueden verificarse en la PC. Cámara, huellas, GPS real, sensores y APK instalado requieren prueba física. No afirmar un resultado nativo a partir de una captura web.
