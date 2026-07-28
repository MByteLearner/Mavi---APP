# MAVI — Asistente Robótico de Nutrición

App móvil (iOS/Android/Web) que actúa como centro de control para un asistente robótico de nutrición: escanea planes nutricionales, sugiere recetas, valida comidas con visión artificial y se sincroniza con una gramera ESP32 por BLE.

## Rol del agente

Desarrollador senior de React Native + Expo. Tipado estricto, código modular, performance móvil. No introducir dependencias nativas nuevas sin necesidad real (rompen el dev client existente).

## Stack

- **Expo SDK 57** (Managed Workflow), `expo-router` (file-based), TypeScript strict
- **Estilos:** `StyleSheet` de RN (NO NativeWind className — el CSS de Tailwind no se inyecta en el bundle web y produce "solo texto sin estilo"). Usar `StyleSheet.create` con tokens de `@/theme`.
- **Estado:** Zustand con `persist` + AsyncStorage (datos persistentes) vs. stores volátiles
- **HTTP / cache:** TanStack Query
- **Hardware:** `react-native-ble-plx` (BLE), `expo-camera` + `expo-image-manipulator`
- **Animaciones:** `react-native-reanimated` 4 + `react-native-gesture-handler` (requiere `GestureHandlerRootView` + `SafeAreaProvider` en el root)
- **Iconos:** `@expo/vector-icons` (Ionicons), wrappeado en `src/components/ui/icons.tsx` — **NO** usar `lucide-react-native` ni `react-native-svg` (causó error nativo; lo desinstalamos y todo ícono es primitivo de RN o @expo/vector-icons)
- **Tipografía:** `Fraunces` (display serif editorial) + `Geist` (sans moderno) cargadas vía `expo-font` en el root layout
- **Forms:** `react-hook-form` + `zod` (instalados, sin uso aún)
- **MQTT:** `mqtt` (instalado para telemetría futura, sin uso actual)

## Comandos

```bash
npm install --legacy-peer-deps   # OBLIGATORIO (peer-deps conflict con @testing-library/react-native@13)
npm start                        # Metro bundler
npm run android | npm run ios | npm run web
npm run lint                     # expo lint (eslint-config-expo flat)
npm run typecheck                 # tsc --noEmit (correr antes de commit)
npm test                          # jest (preset jest-expo, 48 tests)
npm run test:watch | npm run test:coverage
```

**Orden de verificación antes de PR:** `lint` → `typecheck` → `test` (mismo orden que el CI en `.github/workflows/ci.yml`).

## Arquitectura

```
src/
  app/                    # Rutas Expo Router (file-based, dentro de src/app)
    _layout.tsx           # SafeAreaProvider + GestureHandlerRootView + ErrorBoundary + QueryClient + Stack
    +not-found.tsx        # 404
    scan.tsx              # Modal: subir plan (PDF/imagen/cámara)
    preparation.tsx       # Modal: pesaje con gramera (usa useWeightSource)
    validation.tsx        # Modal: cámara + validación IA
    (tabs)/
      _layout.tsx         # 5 tabs: Inicio · Nutrición · IA · Historial · Perfil
      index.tsx           # Home (Hero editorial + dashboard calorías + macros)
      nutrition/          # Recetas
      ia/                 # Chat con MAVI IA
      history.tsx         # Historial comidas + métricas
      profile.tsx         # Perfil + settings
  components/
    ProgressBar.tsx
    CameraPhase.tsx       # Sub-componente de validación
    ui/                   # Design system (Button, Card, Avatar, Chip, Pill, Input,
                          #  Hero, ScreenHeader, EmptyState, ErrorState, Loading, LoadingOverlay,
                          #  Toast, CaloriesRing, MacroProgress, NutritionCard, FoodCard,
                          #  AIRecommendationCard, WaterTracker, GoalCard, ProfileCard,
                          #  AnimatedEntry, Illustrations, icons)
  hooks/
    useColorScheme.ts     # light/dark
    useHaptics.ts         # Wrapper expo-haptics
    useCamera.ts          # Cámara tipada
    useBLEScale.ts        # Driver BLE real (con auto-reconnect)
    useWeightSimulator.ts # Generador de peso (dev)
    useWeightSource.ts    # Orquesta real vs simulador
  services/
    api.ts                # fetch wrapper con ApiError + timeout
    config.ts             # API_CONFIG (lee app.json extra: apiUrl, useMocks)
    storage.ts            # storage + secureStorage (typed)
    planParser.ts         # scanPlan() con mock cuando useMocks=true
    aiValidator.ts        # validateMeal() con mock cuando useMocks=true
    queries.ts            # Hooks TanStack Query (useScanPlanMutation, useValidateMealMutation, useRecipes)
  stores/
    useUserStore.ts       # Persistido: streak, hasScannedPlan, planId, profile, lastCompletedAt
    useSessionStore.ts    # Volátil: activeRecipeId, currentIngredientIndex, currentWeight
    useBLEStore.ts        # Singleton: status, deviceName, error del BLE
  theme/                  # Tokens: palette (red #E53935, gold #D4AF37), typography, spacing, radius, shadow
  constants/              # strings.ts (i18n-ready), ble.ts (UUIDs), recipes.ts
  types/                  # recipe, ble, plan, validation, user, lucide.d.ts (legacy)
  utils/logger.ts         # logger con scope, debug/info solo en __DEV__
__tests__/                # jest, 11 suites
```

## Convenciones y reglas

1. **Estilos: `StyleSheet.create`** con tokens de `@/theme`. NO usar `className` de NativeWind (no se inyecta en web, produce pantalla en blanco).
2. **Componentes funcionales + hooks.** Cero class components.
3. **Hardware: try/catch** con feedback visual claro (toast.error o ErrorState) si falla conexión o permiso.
4. **Permisos:** verificar antes de renderizar componentes que dependan de hardware.
5. **Hooks de UI en `hooks/`, no mezclar con componentes.**
6. **Tokens de `@/theme`:** siempre importar `palette`, `spacing`, `radius`, `typography`, `shadow` de ahí, no hardcodear colores.
7. **Mock vs real:** `useMocks: true` en `app.json > extra` activa respuestas simuladas latentes; cambiar a `false` para apuntar a backend real. La flag la lee `services/config.ts`.
8. **Tipografía:** usar los nombres de tokens (`typography.display`, `typography.button`, etc.) — NO escribir fontSize/lineHeight/fontWeight ad-hoc. Para display/serif usar `fontFamily: 'Fraunces_700Bold'` directo.
9. **Reanimated:** los mutadores `.value =` requieren `// eslint-disable-next-line react-hooks/immutability` (falso positivo del React Compiler).
10. **Tests:** mocks están en `jest.setup.js` (expo-haptics, expo-camera, expo-image-manipulator, react-native-ble-plx, AsyncStorage, reanimated). Para tests de stores usar `useUserStore.setState({...})` en `beforeEach`.

## Gotchas y cosas que un agente puede perderse

- **`npm install` requiere `--legacy-peer-deps`** siempre. Sin el flag falla por conflicto con `@testing-library/react-native@13`.
- **No instalar `react-native-svg` ni `lucide-react-native`** — ya se intentó y rompió el dev client. Si necesitás un ícono nuevo, agregalo a `src/components/ui/icons.tsx` con otro `makeIcon` apuntando a un nombre de Ionicons.
- **El root layout DEBE tener `SafeAreaProvider` + `GestureHandlerRootView`** envolviendo todo. Sin esto, `useSafeAreaInsets()` retorna 0 y el tab bar se superpone con la barra de gestos del sistema.
- **El `tabBarStyle` del `(tabs)/_layout.tsx` usa `useSafeAreaInsets()`** para sumar el `insets.bottom` al `height` y `paddingBottom` de la tab bar. Si tocás ese layout, mantené la lógica de safe area.
- **SafeAreaView de las pantallas** usa `edges={['top']}` — el bottom lo maneja el Tabs automáticamente.
- **El `ErrorBoundary`** en el root layout atrapa errores y los muestra en pantalla. Si ves "Algo salió mal" en gris, mirá el log de Metro.
- **Splash se oculta solo cuando las fuentes cargan** (fontsLoaded). Si la app queda colgada en splash, lo más probable es que `useFonts` no haya resuelto.
- **El bundle web tiene los estilos en `style={...}` inline** vía StyleSheet.create — funcionan sin CSS externo. No hay que inyectar el CSS de Tailwind manualmente.
- **`@/components/ui/icons`** es la única fuente de íconos. `Home`, `Nutrition`, `Sparkles`, `History`, `Person` son los wrappers del tab bar; el resto se importa individualmente.

## CI

`.github/workflows/ci.yml` corre `npm ci --legacy-peer-deps` + `lint` + `typecheck` + `test --ci --coverage` en Node 20. Tiene que pasar antes de mergear.

## Comandos comunes de un agente

- "Agregar una tab nueva": crear carpeta en `src/app/(tabs)/`, agregar `<Tabs.Screen>` en `_layout.tsx`, agregar ícono en `components/ui/icons.tsx`, agregar entrada en `queries.queryKeys` si necesita data.
- "Cambiar un color": editar `src/theme/tokens.ts > palette`. NO hardcodear en componentes.
- "Agregar un endpoint": crear función en `src/services/<nombre>.ts`, agregar hook en `services/queries.ts`, leer mock vs real desde `API_CONFIG.useMocks`.
- "Verificar antes de commit": `npm run lint && npm run typecheck && npm test` (en ese orden, como el CI).
