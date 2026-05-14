**Ionic Todo — App de ejemplo**

Pequeña aplicación de tareas construida con Ionic + Angular (standalone), pensada para evaluación técnica.

**Descripción**: Esta app permite crear, filtrar y gestionar tareas con categorías, persistencia local y feature flags remotas.

**Requisitos**
- Node.js >= 18
- npm >= 9
- Ionic CLI (opcional para desarrollo nativo): `npm install -g @ionic/cli`
- Cordova CLI (solo si se generan builds nativos): `npm install -g cordova`

**Instalación**
1. Clona el repositorio.
2. Instala dependencias:

```bash
npm install
```

**Desarrollo**
- Ejecutar servidor de desarrollo (Ionic):

```bash
ionic serve

```

**Build (Web)**

```bash
ionic build
```

**Plataformas nativas (Cordova)**
- Añadir plataforma Android (Windows):

```bash
ionic cordova platform add android
ionic cordova prepare android --no-build
```

- iOS requiere macOS/Xcode:

```bash
ionic cordova platform add ios
ionic cordova build ios --release
```

**Feature Flags (Firebase Remote Config)**
- La app usa Firebase Remote Config para toggles de features. Ejemplo de flag usado: `show_delete_button`.
- Revisa `src/app/services/config.service.ts` para ver la integración y claves esperadas.

**Arquitectura**
- Framework: Angular 17+ (standalone components)
- UI: Ionic Angular v8
- Estado: RxJS (BehaviorSubject, combineLatest, map)
- Persistencia local: Ionic Storage Angular
- Servicios clave:
  - `src/app/services/todo.service.ts` — gestión de tareas y almacenamiento
  - `src/app/services/config.service.ts` — remote config / feature flags

**Sistema de diseño y variables**
- Variables centrales: [src/theme/variables.scss](src/theme/variables.scss)
- Regla estricta: no usar colores hardcoded. Usa siempre las variables SCSS definidas.
- Estructura SCSS: archivos de componentes bajo `src/theme/components/` con clases `ds-*` reutilizables.

**Estilos y temas**
- El `ion-content` por defecto se fuerza a fondo claro en [src/global.scss](src/global.scss).
- Para cambiar la paleta, edita [src/theme/variables.scss](src/theme/variables.scss) y mantén consistencia en los componentes.

**Comandos útiles**
- Instalar dependencias: `npm install`
- Iniciar dev: `ionic serve`
- Build web: `npm run build`

**Buenas prácticas y aportes**
- No introducir colores hardcoded. Usa variables en [src/theme/variables.scss](src/theme/variables.scss).
- Mantener componentes SCSS pequeños y reutilizables.

**Archivos importantes**
- [src/theme/variables.scss](src/theme/variables.scss) — paleta y variables globales
- [src/global.scss](src/global.scss) — imports globales de diseño
- `src/app/pages/home/` — pantalla principal
- `src/app/services/` — lógica y configuración

**Autor**
Desarrollado por Harinton David Ariza Vargas.
