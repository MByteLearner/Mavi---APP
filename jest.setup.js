jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => null,
}));

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
  NotificationFeedbackType: { Success: 'success', Warning: 'warning', Error: 'error' },
}));

jest.mock('expo-camera', () => ({
  CameraView: () => null,
  useCameraPermissions: () => [{ granted: true }, jest.fn()],
}));

jest.mock('expo-image-manipulator', () => ({
  manipulateAsync: jest.fn(async (uri) => ({ uri, width: 100, height: 100 })),
  SaveFormat: { JPEG: 'jpeg' },
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(async () => null),
  setItemAsync: jest.fn(async () => {}),
  deleteItemAsync: jest.fn(async () => {}),
}));

jest.mock('expo-constants', () => ({
  __esModule: true,
  default: {
    expoConfig: {
      extra: {
        apiUrl: 'http://localhost:3000/api',
        useMocks: true,
      },
    },
  },
}));

jest.mock('react-native-ble-plx', () => ({
  BleManager: jest.fn().mockImplementation(() => ({
    state: jest.fn().mockResolvedValue('PoweredOn'),
    startDeviceScan: jest.fn(),
    stopDeviceScan: jest.fn(),
  })),
  State: { PoweredOn: 'PoweredOn' },
}));

jest.mock('@react-native-async-storage/async-storage', () => {
  const storage = {};
  return {
    __esModule: true,
    default: {
      getItem: jest.fn(async (k) => storage[k] ?? null),
      setItem: jest.fn(async (k, v) => {
        storage[k] = v;
      }),
      removeItem: jest.fn(async (k) => {
        delete storage[k];
      }),
      clear: jest.fn(async () => {
        for (const k of Object.keys(storage)) delete storage[k];
      }),
    },
  };
});

global.__reanimatedWorkletInit = jest.fn();

