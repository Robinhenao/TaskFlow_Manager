# TaskFlow Manager

Aplicación web de gestión de tareas desarrollada en Angular 19 con autenticación simulada, manejo de roles y dashboard dinámico.

## 🚀 Demo

> URL de despliegue: https://task-flow-manager-three.vercel.app/login

---

## 📋 Requisitos previos

- Node.js v22
- Angular CLI v19

```bash
npm install -g @angular/cli
```

---

## ⚙️ Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/Robinhenao/TaskFlow_Manager.git

# 2. Entrar al directorio
cd TaskFlow_Manager

# 3. Instalar dependencias
npm install

# 4. Iniciar el servidor de desarrollo
ng serve
```

Abrir en el navegador: `http://localhost:4200`

---

## 🧪 Tests

```bash
# Correr todos los tests
ng test --watch=false

# Con reporte de cobertura
ng test --watch=false --code-coverage
```

Cobertura actual: **+120 tests** distribuidos en servicios, guards, componentes y directivas.

---

## 👤 Credenciales de prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | admin@test.com | Abcdef1! |
| Usuario | user@test.com | Abcdef1! |

---

## 🏗️ Arquitectura

El proyecto sigue una **arquitectura modular** con separación clara de responsabilidades:

```
src/
└── app/
    ├── app.module.ts
    ├── app-routing.module.ts
    │
    ├── core/                                        # Servicios globales, guards, interceptors
    │   ├── core.module.ts
    │   ├── guards/
    │   │   ├── auth.guard.ts                        # Protege rutas privadas
    │   │   └── role.guard.ts                        # Protege rutas por rol
    │   ├── interceptors/
    │   │   └── auth.interceptor.ts                  # Adjunta token en cada petición HTTP
    │   ├── models/
    │   │   └── user.model.ts
    │   ├── services/
    │   │   ├── auth.service.ts                      # Autenticación simulada con JWT falso
    │   │   └── task.service.ts                      # CRUD de tareas con persistencia
    │   └── validators/
    │       └── password.validator.ts                # Validador custom de contraseña
    │
    ├── features/                                    # Módulos de funcionalidades (lazy loading)
    │   ├── auth/
    │   │   ├── auth.module.ts
    │   │   ├── auth-routing.module.ts
    │   │   └── pages/
    │   │       └── login/
    │   │           ├── login.component.ts
    │   │           ├── login.component.html
    │   │           └── login.component.scss
    │   ├── dashboard/
    │   │   ├── dashboard.module.ts
    │   │   ├── dashboard-routing.module.ts
    │   │   └── pages/
    │   │       └── dashboard/
    │   │           ├── dashboard.component.ts
    │   │           ├── dashboard.component.html
    │   │           └── dashboard.component.scss
    │   └── tasks/
    │       ├── tasks.module.ts
    │       ├── tasks-routing.module.ts
    │       └── pages/
    │           ├── task-form/
    │           │   ├── task-form.component.ts
    │           │   ├── task-form.component.html
    │           │   └── task-form.component.scss
    │           └── task-list/
    │               ├── task-list.component.ts
    │               ├── task-list.component.html
    │               └── task-list.component.scss
    │
    └── shared/                                      # Componentes, pipes y directivas reutilizables
        ├── shared.module.ts
        ├── components/
        │   ├── button/
        │   ├── card/
        │   ├── input/
        │   ├── layout/
        │   ├── modal/
        │   ├── navbar/
        │   ├── sidebar/
        │   ├── stats-card/
        │   └── task-card/
        ├── directives/
        │   └── highlight.directive.ts               # Directiva personalizada
        └── pipes/
            └── status.pipe.ts                       # Pipe personalizado de estado
```

---

## 🔀 Rutas

| Ruta | Módulo | Protección |
|------|--------|------------|
| `/login` | AuthModule | Pública |
| `/dashboard` | DashboardModule | AuthGuard |
| `/tasks` | TasksModule | AuthGuard |
| `/**` | — | Redirige a `/login` |

Todas las rutas privadas usan **lazy loading** para optimizar la carga inicial.

---

## 🔐 Autenticación

- Login simulado sin backend real
- JWT falso generado con `btoa()` en el frontend
- Token almacenado en `localStorage`
- Roles: `ADMIN` y `USER`
- `AuthGuard` bloquea rutas sin sesión activa
- `RoleGuard` restringe acceso según rol
- `AuthInterceptor` adjunta el token en cada petición HTTP simulada

---

## ✅ Funcionalidades Angular demostradas

- Reactive Forms con validadores built-in y custom (`strongPasswordValidator`)
- `ChangeDetectionStrategy.OnPush` + Signals
- Pipes personalizados (`StatusPipe`)
- Directivas personalizadas (`HighlightDirective`)
- Content projection (`ng-content`)
- Lazy loading en todos los feature modules
- `BehaviorSubject` y `combineLatest` con RxJS
- `trackBy` en listas de tareas
- Simulación de HTTP con `of()`, `delay()`, `throwError()`
- `HttpInterceptor` para manejo de token y errores 401

---

## 🛡️ Seguridad Frontend

- Sanitización de datos con Angular DomSanitizer
- Protección básica contra XSS
- Control de acceso por rol en rutas y vistas
- Token no expuesto en variables de entorno públicas
- Manejo seguro de `localStorage`

---

## 🎨 Diseño

Kit UI de Figma utilizado: [Task Management Dashboard](https://www.figma.com/community/file/1197498556836882883/task-management-dashboard)

Implementado con **Tailwind CSS** replicando:
- Navbar
- Sidebar
- Cards de tareas
- Modal
- Botón personalizado
- Input con validación visual

---

## 🔧 Decisiones técnicas

**Sin backend real** — Todo el estado se maneja con `BehaviorSubject` y se persiste en `localStorage`, simulando las respuestas con `of()` y `delay()` de RxJS.

**OnPush + Signals** — Se usa `ChangeDetectionStrategy.OnPush` en todos los componentes junto con `signal()` para garantizar detección de cambios eficiente y predecible.

**Arquitectura modular con lazy loading** — Cada feature es un módulo independiente que se carga bajo demanda, reduciendo el bundle inicial y facilitando la escalabilidad.

**Validadores custom** — `strongPasswordValidator` valida mayúsculas, números y caracteres especiales de forma reutilizable e independiente del componente.

**Pipe personalizado** — `StatusPipe` transforma los estados internos (`PENDING`, `IN_PROGRESS`, `COMPLETED`) a textos legibles para el usuario.

**Directiva personalizada** — `HighlightDirective` aplica estilos dinámicos a elementos según su estado, demostrando el uso de directivas de atributo.

---

## 📦 Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `ng serve` | Servidor de desarrollo |
| `ng build` | Build de producción |
| `ng test --watch=false` | Ejecutar tests |
| `ng test --code-coverage` | Tests con cobertura |
