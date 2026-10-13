# Guía Git y SemVer

La carpeta tiene su propio repositorio local inicializado por create-expo-app. El repositorio de entrega es [nehuenparrondo/device-tools](https://github.com/nehuenparrondo/device-tools), público por solicitud del autor, con rama principal `main`. La publicación se preparó el 12 de octubre de 2026; no se incluyen node_modules, archivos generados ni credenciales.

## Primer commit y GitHub (referencia para un proyecto nuevo)

```powershell
git status
git add .
git commit -m "feat: implementar herramientas nativas y SQLite"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/device-tools.git
git push -u origin main
```

Estos pasos son una referencia para otro proyecto: no volver a crear el remoto del repositorio ya vinculado. Reemplazar TU_USUARIO y no copiar un remoto de otro trabajo. En este proyecto, comprobar `git remote -v` y usar `git push` para publicar nuevos commits.

## Flujo de ramas

```powershell
git switch -c develop
git switch -c feature/nueva-herramienta
git add .
git commit -m "feat: agregar nueva herramienta"
git switch develop
git merge feature/nueva-herramienta
```

main contiene entregas estables, develop integra trabajo y feature/* delimita cambios. Revisar con una Pull Request cuando se publique; no es obligatorio tener servidor para usar Git.

## Commits convencionales

| Prefijo   | Uso                                       |
| --------- | ----------------------------------------- |
| feat:     | Función nueva                             |
| fix:      | Corrección funcional                      |
| docs:     | README/guías                              |
| refactor: | Reorganización sin cambiar comportamiento |
| style:    | Formato del código                        |
| chore:    | Dependencias/configuración                |

## Versiones

- 1.0.1: corrección compatible.
- 1.1.0: herramienta nueva compatible.
- 2.0.0: cambio incompatible de contrato/comportamiento.

Mantener package.json, app.json y CHANGELOG coordinados. Para una nueva migración, aumentar SCHEMA_VERSION y agregar SQL al final de MIGRATIONS, sin editar migraciones ya distribuidas.

## Entrega de APK

Crear una Release con tag v1.0.0 después de comprobar el APK; adjuntar el archivo o un enlace EAS y capturas reales. APK/AAB están ignorados para evitar binarios en el historial Git. Mantener privada la clave de firma y no subir .env, keystores, credenciales, ubicación ni fotografías personales.
