# MAVI

MAVI es una aplicación móvil (iOS/Android) que actúa como centro de control para un asistente robótico de nutrición. Permite escanear planes nutricionales, sugerir recetas, validar comidas mediante visión artificial (cámara) y sincronizarse con una gramera física (hardware ESP32) para un pesaje asistido de ingredientes.

## Stack

- **Framework:** Expo (React Native) con Managed Workflow, Expo Router (file-based routing)
- **Lenguaje:** TypeScript (strict mode)
- **Estilos:** NativeWind v4 (Tailwind CSS)
- **Estado:** Zustand (con `persist` para datos persistentes)
- **Data fetching:** TanStack Query
- **Hardware:** `react-native-ble-plx` (BLE con ESP32), `expo-camera` + `expo-image-manipulator`
- **Animaciones:** `react-native-reanimated` 4
- **Tests:** Jest + `@testing-library/react-native`

## Estructura del proyecto

```
src/
  app/                  # Rutas (Expo Router)
    (tabs)/             # Tab navigator (Inicio, Recetas, Progreso, Perfil)
    scan.tsx            # Escaneo de plan nutricional
    preparation.tsx     # Flujo de pesaje con gramera
    validation.tsx      # Validación de plato con cámara
    +not-found.tsx      # 404
  components/
    ui/                 # Componentes reutilizables (Button, Card, IconTile, etc.)
    CameraPhase.tsx     # Sub-componente de cámara
  hooks/                # Custom hooks (useBLEScale, useWeightSource, useHaptics, etc.)
  services/             # API client + queries TanStack Query + mocks
  stores/               # Zustand stores (useUserStore, useSessionStore, useBLEStore)
  theme/                # Tokens de diseño
  types/                # Tipos compartidos
  constants/            # Strings, BLE constants, recetas
  utils/                # Utilidades (logger)

__tests__/              # Tests unitarios (Jest + RNTL)
```

## Configuración

### Requisitos
- Node.js 20+
- Expo CLI
- Dispositivo físico o emulador iOS/Android

### Instalación

```bash
npm install --legacy-peer-deps
```

### Variables de entorno (opcional)

En `app.json`, dentro de `expo.extra`:

```json
{
  "extra": {
    "apiUrl": "https://api.mavi.app",
    "useMocks": true
  }
}
```

- `useMocks: true` (default) usa respuestas simuladas de plan y validación.
- `useMocks: false` llama al backend real en `apiUrl`.

## Scripts

| Comando | Descripción |
|---|---|
| `npm start` | Inicia Metro Bundler |
| `npm run android` | Build y corre en Android |
| `npm run ios` | Build y corre en iOS |
| `npm run web` | Inicia versión web |
| `npm run lint` | Ejecuta ESLint con config de Expo |
| `npm run typecheck` | TypeScript strict mode check |
| `npm test` | Corre tests con Jest |
| `npm run test:coverage` | Tests + reporte de cobertura |
| `npm run test:watch` | Tests en modo watch |

## Hardware

### Gramera ESP32

- Nombre del dispositivo: `MAVI_SCALE` (configurable en `src/constants/ble.ts`)
- Service UUID: `0000fff0-0000-1000-8000-00805f9b34fb`
- Characteristic UUID: `0000fff1-0000-1000-8000-00805f9b34fb`
- Formato del payload: 2 bytes little-endian, valor en gramos × 10 (parseado en `useBLEScale.parseWeightPayload`)

Si no hay gramera conectada, la app usa automáticamente el simulador (`useWeightSimulator`).

### Cámara

- Permisos configurados en `app.json` (iOS y Android)
- Captura + compresión en `useCamera`
- Validación mockeada en `src/services/aiValidator.ts` (reemplazable por API real)

## Mock vs backend

Mientras no exista backend, todos los servicios en `src/services/` están mockeados con latencia simulada. Para conectar a un backend real:

1. Configurar `apiUrl` y `useMocks: false` en `app.json`
2. Implementar los endpoints en el backend:
   - `POST /api/plans/scan` → recibe archivo (PDF o imagen), devuelve `{ plan, suggestedRecipes }`
   - `POST /api/meals/validate` → recibe foto + recipeId, devuelve `{ success, confidence, message, detectedIngredients }`

Los tipos compartidos están en `src/types/plan.ts` y `src/types/validation.ts`.

## Dark mode

Activado por NativeWind (`darkMode: "class"`). El hook `useColorScheme` aplica la clase `dark` al root en función del esquema del sistema.

## Accesibilidad

- `accessibilityLabel` en todos los botones de íconos
- `accessibilityRole="button"` consistente
- `accessibilityLiveRegion="polite"` en el display numérico de peso
- `accessibilityRole="progressbar"` en `ProgressBar`

## Licencia

MIT
