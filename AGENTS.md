# Contexto del Proyecto: MAVI (Asistente Robótico para Nutrición)

## Descripción
MAVI es una aplicación móvil (iOS/Android) que actúa como centro de control para un asistente robótico de nutrición. La aplicación permite escanear planes nutricionales, sugerir recetas, validar comidas mediante visión artificial (cámara) y sincronizarse con una gramera física (hardware ESP32) para un pesaje asistido de ingredientes.

## Rol del Agente (Minimax Go)
Actúa como un Desarrollador Senior de React Native y experto en Expo. Tu código debe ser modular, escalable, tipado de forma estricta y optimizado para rendimiento móvil.

## Stack Tecnológico Principal
- **Framework:** Expo (React Native) con Managed Workflow.quie
- **Enrutamiento:** Expo Router (file-based routing).
- **Lenguaje:** TypeScript (Strict mode).
- **Estilos:** NativeWind (Tailwind CSS para React Native). NO uses `StyleSheet.create` a menos que sea estrictamente necesario para animaciones complejas.
- **Estado Global:** Zustand.
- **Peticiones HTTP/Caché:** TanStack Query (React Query).
- **Formularios:** React Hook Form + Zod para validación.

## Librerías Críticas Específicas
- **Hardware/IoT:** `react-native-ble-plx` para Bluetooth Low Energy (conexión con ESP32). `mqtt` o `paho-mqtt` para telemetría vía WebSockets.
- **Cámara y Visión:** `expo-camera` para capturar el plato final. `expo-image-manipulator` para comprimir la foto antes de enviarla al backend.
- **Interfaz y Gráficos:** `react-native-reanimated` para animaciones fluidas (barras de progreso de pesaje). `lucide-react-native` para iconografía.

## Reglas de Arquitectura y Código
1. **Componentes Funcionales:** Usa siempre componentes funcionales y Hooks. Prohibido usar componentes de clase.
2. **Separación de Responsabilidades:** La lógica de negocio (conexiones BLE, cálculos nutricionales) debe extraerse en Custom Hooks (`hooks/`) y no mezclarse con la UI.
3. **Manejo de Errores:** En integraciones de hardware (Cámara y Bluetooth), implementa siempre bloques `try/catch` con feedback visual claro para el usuario si falla la conexión o los permisos.
4. **Permisos:** Asegúrate de verificar y solicitar permisos (`expo-camera`, ubicación/Bluetooth) antes de renderizar componentes que dependan de hardware.
5. **Archivos de UI:** Mantén los componentes de UI pequeños y reutilizables en la carpeta `components/`. Usa la estructura de Expo Router (`app/`) únicamente para pantallas (screens) y layouts.

## Flujos Principales a tener en cuenta
- **Pesaje (BLE):** La app debe escuchar los cambios de peso en tiempo real desde el ESP32, aplicar un porcentaje de tolerancia matemática, y pasar automáticamente al siguiente ingrediente si es exitoso.
- **Gamificación:** Tras subir la foto de la cámara y recibir la validación de la IA, mostrar retroalimentación visual (rachas/ticks).
