# Plan de pruebas manuales

Registrar fecha, modelo, versión de Android/iOS, tipo de ejecución (Expo Go, development build o preview APK), pasos, resultado y captura. La validación final requiere el APK instalado en un Android físico.

| ID  | Caso                                                        | Resultado esperado                                                           |
| --- | ----------------------------------------------------------- | ---------------------------------------------------------------------------- |
| P01 | Instalación y primera apertura                              | Inicia sin cierre inesperado ni solicitudes anticipadas de cámara/GPS        |
| P02 | Denegar cámara, volver y conceder desde ajustes             | Estado de permiso; acceso a ajustes; visor al volver                         |
| P03 | Cámara frontal/trasera, flash y linterna                    | Cámara única activa y controles legibles                                     |
| P04 | Capturar, agregar nota/tags y guardar                       | Foto visible en historial; sigue existiendo tras reiniciar                   |
| P05 | Exportar foto a galería; denegar permiso                    | Mensaje claro y copia de historial conservada                                |
| P06 | QR URL, QR texto, EAN-13 y Code128                          | Tipo/contenido correctos; una lectura por sesión                             |
| P07 | Mantener QR frente a cámara varios segundos                 | No repite guardados ni eventos visibles                                      |
| P08 | Copiar QR; abrir URL aceptando/cancelando                   | Copia correcta; abre solo tras confirmar                                     |
| P09 | QR con javascript:, intent: o texto vacío                   | Sin apertura insegura; mensaje para datos inválidos                          |
| P10 | Denegar ubicación y apagar servicio GPS                     | Error claro y acción de configuración                                        |
| P11 | GPS con/sin señal, adentro y afuera                         | Timeout en lectura actual sin señal; precisión real en metros                |
| P12 | Seguimiento inicio/parada y cambio de pestaña               | Lectura en vivo; suscripción eliminada al salir                              |
| P13 | Dirección sin Internet                                      | Coordenadas guardables; dirección no disponible                              |
| P14 | Abrir mapa y guardar un punto                               | Posición correcta y persistencia local                                       |
| P15 | Sensores con intervalos 100/250/500/1000 ms                 | Lectura adaptable sin duplicar suscripciones                                 |
| P16 | Inclinar y agitar con moderación                            | Pelota acotada, barras x/y/z, vibración y contador con cooldown              |
| P17 | Emulador/teléfono sin barómetro/magnetómetro                | Estado no disponible, resto funcional                                        |
| P18 | Podómetro permiso concedido/denegado                        | Pasos de sesión o mensaje y ajustes                                          |
| P19 | Biometría correcta/fallida/cancelada                        | Mensaje de resultado; cancelación nunca desbloquea                           |
| P20 | Dispositivo sin hardware o sin biometría registrada         | Explicación y alternativa manual explícita                                   |
| P21 | Historial desbloqueado → otra tab/segundo plano → volver    | Nuevo bloqueo; sin registros visibles antes de desbloquear                   |
| P22 | Historial vacío, filtros foto/código/GPS y orden            | Vacío útil y orden descendente por fecha                                     |
| P23 | Borrar con cancelación y con confirmación                   | Cancelar conserva; confirmar elimina detalle/tags y foto privada             |
| P24 | Foto previamente exportada al álbum y borrada del historial | Copia del álbum permanece                                                    |
| P25 | Tema en todas las tabs, reinicio y tema del sistema         | Texto, superficies, tabs y status bar correctos; preferencia persistente     |
| P26 | Scroll de inicio, historial y Extras                        | Flecha aparece después de 240 px, anima y vuelve al inicio correcto          |
| P27 | Cambio de tabs con distintos offsets                        | Flecha apunta al scroll de la tab actual; cámara sin scroll no la muestra    |
| P28 | Teléfono vertical/horizontal, tablet ambas orientaciones    | Grilla cambia, cámara/sensores adaptan, sin controles cortados               |
| P29 | Fuente grande, lector de pantalla y teclado                 | Labels útiles, áreas >=44 px, campos y botones alcanzables                   |
| P30 | Batería/red: carga, Wi-Fi y modo avión                      | Estado se actualiza; valor desconocido no equivale a cero                    |
| P31 | Galería: seleccionar, cancelar y denegar                    | Copia persistente o feedback claro, sin registro ficticio                    |
| P32 | Brillo: cambiar, salir y llevar app a segundo plano         | Brillo original restaurado                                                   |
| P33 | Voz: iniciar/detener y salir mientras lee                   | Detiene lectura y libera acción                                              |
| P34 | Portapapeles vacío/texto largo                              | Mensaje claro y texto recortado al límite                                    |
| P35 | Web: visitar cada ruta                                      | Interfaz funcional; hardware degrada sin cargar SQLite nativo                |
| P36 | Cerrar y reabrir app sin Internet                           | Historial, fotos y tema persisten; geocodificación puede no estar disponible |
| P37 | Limpiar caché sin borrar datos de app                       | Fotos guardadas siguen disponibles fuera de caché                            |
| P38 | Actualizar instalación con misma firma                      | Migraciones conservan datos; no desinstalar para esta prueba                 |

## Procedimiento mínimo antes de entregar

1. Ejecutar npm run check.
2. Completar P01–P29 en teléfono físico; P30–P34 para extras.
3. Instalar el APK preview y repetir permisos, captura, GPS, sensores, biometría y persistencia offline.
4. Revisar errores de consola y logs nativos sin guardar información personal.
5. Adjuntar capturas y resultados; marcar cada caso como aprobado/fallido/no aplica con justificación.

No agitar el teléfono de forma que pueda caer. No usar ubicaciones personales reales en capturas públicas.
