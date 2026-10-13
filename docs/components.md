# Componentes y extensión

## Atomic Design

| Nivel      | Componentes                                                                                                      | Responsabilidad                                                 |
| ---------- | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Átomos     | AppText, AppButton, IconButton, StatusBadge, ThemeToggleButton, ScrollToTopButton, SensorGauge                   | Texto, acciones accesibles, estado, animación y medición visual |
| Moléculas  | Card, StatePanel, PermissionGate, ToolCard, MetadataForm, LocationInfo, MotionBall                               | Agrupaciones de una sola responsabilidad                        |
| Organismos | ScreenContainer, ResponsiveGrid, CameraViewport, ScannerGuide, SensorPanel, HistoryList, AppTabBar               | Bloques completos que reciben datos y callbacks                 |
| Páginas    | HomePage, CameraPage, ScannerPage, LocationPage, SensorsPage, BiometricsPage, HistoryPage, ExtrasPage, AboutPage | Composición de la pantalla con props PageProps                  |
| Rutas      | app/(tabs)/*.tsx                                                                                                 | Renderizar una página con título y descripción tipados          |

Las páginas no invocan APIs de hardware. Los hooks gestionan estados, permisos y suscripciones; los servicios encapsulan el acceso real al dispositivo. PermissionGate recibe una solicitud como callback y no conoce la API específica.

## Contratos principales

- AppButton: label, onPress, disabled, busy, secondary, danger; área mínima 48 px.
- ScreenContainer: title, subtitle, children. Registra su ScrollView al enfocar la ruta y conserva offset por pantalla.
- ResponsiveGrid: children. Una columna en teléfono vertical, dos en tablet/teléfono horizontal y tres desde 1100 px.
- CameraViewport: cameraRef, facing, flash, torch, onReady, onError, onScan. CameraControls agrega acciones superpuestas en una fila horizontal desplazable con espacio para el botón flotante.
- SensorPanel: title, data, status, error, unit, range.
- HistoryList: records discriminados por kind, onRemove y busy.
- MetadataForm: valores y callbacks controlados, sin persistencia interna.

Los tamaños fijos se reservan para iconos y áreas táctiles; paneles, cámara, fotos, marco de escaneo y visualización de movimiento usan flex, porcentajes y límites máximos.

## Agregar una herramienta

1. Crear tipos de datos en src/types/.
2. Encapsular su API en src/services/ y comprobar soporte/plataforma.
3. Crear un hook en src/hooks/ con limpieza de efectos, permiso bajo demanda y manejo de error.
4. Componer la página con ScreenContainer y componentes atómicos.
5. Crear una ruta fina que pase props PageProps.
6. Agregar una entrada a TOOLS y, si corresponde, disponibilidad en deviceService.
7. Si guarda datos, agregar una nueva migración; no modificar las ya distribuidas.
8. Documentar permisos, pruebas manuales y cambios en CHANGELOG.

## Consideraciones de ciclo de vida

El visor de cámara se desmonta al perder foco o al ir a segundo plano; solo hay una cámara activa. Sensores y GPS eliminan su propia suscripción. Los resultados asíncronos tardíos se descartan mediante cancelación o número de sesión. El historial vuelve a bloquearse y vacía los datos visibles. El brillo se restaura y la voz se detiene al salir de Extras.

ESLint mantiene reglas de hooks, refs y dependencias. La regla set-state-in-effect se exceptúa exclusivamente en hooks/contextos que sincronizan y reinician estado de APIs externas de hardware; la justificación figura en la configuración.
