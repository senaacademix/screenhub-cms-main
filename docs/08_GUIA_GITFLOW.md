# Flujo de Trabajo Git (GitFlow): ScreenHub

Este documento define una propuesta de trabajo colaborativo usando **GitFlow** para el repositorio de ScreenHub.

---

## Objetivo

- Mantener `main` siempre estable y desplegable.
- Usar `develop` como rama de integración del trabajo diario.
- Reducir conflictos con ramas cortas, PRs pequeños y revisiones obligatorias.
- Dar un flujo claro para **3 desarrolladores principales** (Jaime, Fredy, Deimer) y **4 aprendices**.

---

## Ramas del Repositorio

### `main`

- **Definición**: rama estable del producto.
- **Propósito**: código listo para release (producción o “deployable”).
- **Regla**: nadie desarrolla directamente aquí.
- **Entradas permitidas**: merges desde `release/*` y `hotfix/*`.

### `develop`

- **Definición**: rama de integración diaria del equipo.
- **Propósito**: concentrar el trabajo de features y fixes antes de preparar una release.
- **Regla**: toda feature/bugfix entra aquí mediante PR.
- **Estado esperado**: compila y pasa validaciones mínimas (`npm run build`, `npm run lint`).

### `feature/*`

- **Definición**: ramas para desarrollar nuevas funcionalidades o mejoras.
- **Propósito**: aislar un cambio de producto hasta que esté listo para integrarse.
- **Origen**: `develop`
- **Destino**: PR hacia `develop`
- **Cuándo usar**: cuando el objetivo principal es agregar comportamiento nuevo (UI, endpoints, reglas, pantallas).
- **Ejemplos**:
  - `feature/auth-social-login`
  - `feature/admin-users-table`

### `fix/*` (opcional)

- **Definición**: ramas para corregir bugs encontrados durante el desarrollo.
- **Propósito**: arreglar fallos no urgentes de producción (si fuera urgente, usar `hotfix/*`).
- **Origen**: `develop`
- **Destino**: PR hacia `develop`
- **Cuándo usar**: cuando es un bug detectado en QA/desarrollo o en `develop`.
- **Ejemplo**: `fix/prisma-import-path`

### `release/*`

- **Definición**: ramas para estabilizar una versión candidata antes de publicar.
- **Propósito**: congelar el alcance y enfocarse en correcciones/ajustes para publicar.
- **Origen**: `develop`
- **Destino**: PR hacia `main` (y back-merge hacia `develop` si hubo fixes en release).
- **Cuándo usar**: cuando el equipo decide “esta versión va para `main`” y se evita meter features nuevas.
- **Ejemplos**:
  - `release/0.2.0`
  - `release/2026-05`

### `hotfix/*`

- **Definición**: ramas para arreglos urgentes que deben salir desde `main`.
- **Propósito**: corregir producción rápidamente sin depender del estado de `develop`.
- **Origen**: `main`
- **Destino**: PR hacia `main` y back-merge hacia `develop`.
- **Cuándo usar**: caída del sistema, bug crítico, vulnerabilidad o bloqueo de usuarios en producción.
- **Ejemplo**: `hotfix/login-redirect-loop`

---

## Arranque desde el estado actual (ya hay cambios en `main`)

Como `main` ya tiene cambios, el punto de partida recomendado es:

- Crear `develop` **desde el estado actual de `main`**.
- Desde ese momento:
  - trabajo diario → `feature/*` desde `develop`
  - integración → PRs a `develop`
  - releases → `release/*` desde `develop` hacia `main`

Esto evita “rehacer historia” y alinea a todo el equipo desde lo que ya está funcionando.

---

## Convención de nombres (para 3 devs + aprendices)

Se recomienda incluir el responsable al inicio para trazabilidad:

- Principales: `jaime/feature/...`, `fredy/feature/...`, `deimer/feature/...`
- Aprendices: `aprendiz-nombre/feature/...`

Ejemplos:
- `jaime/feature/roles-ui`
- `fredy/fix/proxy-matcher`
- `aprendiz-lina/feature/publisher-page`

Si prefieren menos largo, pueden omitir el prefijo de usuario y mantener solo `feature/*`, pero entonces el PR debe tener asignado responsable.

---

## Flujo diario (paso a paso)

1. Crear rama desde `develop`:
   - `feature/*` o `fix/*`
2. Commits frecuentes (pequeños) con mensaje claro.
3. Mantener la rama actualizada con `develop` si el PR vive varios días.
4. Abrir PR hacia `develop` cuando:
   - compila (`npm run build`)
   - pasa lint (`npm run lint`)
   - no incluye archivos generados ni secretos
5. Merge a `develop` usando “Squash and merge” (recomendado) para historial limpio.

---

## Mensajes de commit (ejemplo)

Se recomienda usar un formato consistente para que el historial sea fácil de leer.

Formato sugerido:

`<tipo>(<scope>): <mensaje>`

Tipos recomendados:

- `feat`: nueva funcionalidad
- `fix`: corrección de bug
- `chore`: tareas de mantenimiento (scripts, deps)
- `docs`: documentación
- `refactor`: refactor sin cambio funcional esperado

Ejemplo real:

```bash
git commit -m "fix(prisma): corregir ruta de import del cliente"
```

---

## 🧪 Ejemplo completo del flujo (comandos)

### Escenario 1: Feature normal (trabajo diario)

#### 0) Crear `develop` desde `main` (solo la primera vez)

```bash
git checkout main
git pull
git checkout -b develop
git push -u origin develop
```

#### 1) Crear una feature branch desde `develop`

```bash
git checkout develop
git pull
git checkout -b jaime/feature/admin-users-table
```

#### 2) Hacer commits (uno o varios)

```bash
git add .
git commit -m "feat(admin): agregar tabla de usuarios"
git push -u origin jaime/feature/admin-users-table
```

#### 3) Abrir PR hacia `develop` y hacer merge

- Abrir un Pull Request: `jaime/feature/admin-users-table` → `develop`
- Pasar checks (`npm run build`, `npm run lint`) y revisión
- Merge (recomendado: “Squash and merge”)

#### 4) Preparar release cuando `develop` esté listo

```bash
git checkout develop
git pull
git checkout -b release/0.2.0
git push -u origin release/0.2.0
```

#### 5) Finalizar release hacia `main` (y etiquetar)

```bash
git checkout main
git pull
git merge --no-ff release/0.2.0
git tag -a v0.2.0 -m "Release v0.2.0"
git push origin main --tags
```

#### 6) Back-merge a `develop` si hubo cambios en release

```bash
git checkout develop
git pull
git merge --no-ff main
git push origin develop
```

### Escenario 2: Hotfix urgente (producción)

#### 1) Crear hotfix desde `main`

```bash
git checkout main
git pull
git checkout -b hotfix/login-redirect-loop
```

#### 2) Commit del fix y push

```bash
git add .
git commit -m "fix(auth): evitar loop de redirección en login"
git push -u origin hotfix/login-redirect-loop
```

#### 3) PR hacia `main`, merge, tag, y back-merge a `develop`

```bash
git checkout main
git pull
git tag -a v0.2.1 -m "Hotfix v0.2.1"
git push origin main --tags

git checkout develop
git pull
git merge --no-ff main
git push origin develop
```

---

## Reglas de Pull Request (PR)

### Revisión

- PR de aprendiz → requiere revisión de **al menos 1 dev principal**.
- PR de dev principal → requiere revisión de **otro dev principal** (idealmente).
- PRs grandes se dividen en PRs pequeños por feature/subtarea.

### Checklist mínimo del PR

- El PR describe qué cambia y por qué.
- `npm run build` y `npm run lint` pasan.
- No se suben secretos:
  - nunca commitear `.env` ni `env` con credenciales reales
- No se suben artefactos generados:
  - `src/generated/prisma` debe generarse con `prisma generate` (está ignorado por git)

---

## Flujo de release

1. Cuando `develop` está listo para publicar, crear `release/<version>` desde `develop`.
2. En `release/*` solo se permiten:
   - fixes
   - ajustes de versión
   - cambios mínimos para estabilizar
3. PR `release/*` → `main`.
4. Tag en `main` (ej. `v0.2.0`) cuando el merge termine.
5. Back-merge `main` → `develop` si hubo commits en `release/*` que no estaban en `develop`.

---

## Flujo de hotfix (urgente)

1. Crear `hotfix/*` desde `main`.
2. PR `hotfix/*` → `main` (con revisión).
3. Tag en `main`.
4. Back-merge `main` → `develop` para no perder el fix.

---

## Reglas recomendadas de protección de ramas (GitHub/GitLab)

- Proteger `main` y `develop`:
  - requerir PR
  - requerir 1 aprobación mínima
  - bloquear push directo
- Requerir checks mínimos antes de merge:
  - `npm run build`
  - `npm run lint`
- Permitir “Squash merge” como estrategia principal.

