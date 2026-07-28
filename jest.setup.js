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

jest.mock('react-native-ble-plx', () => ({
  BleManager: jest.fn().mockImplementation(() => ({
    state: jest.fn().mockResolvedValue('PoweredOn'),
    startDeviceScan: jest.fn(),
    stopDeviceScan: jest.fn(),
  })),
  State: { PoweredOn: 'PoweredOn' },
}));

jest.mock('@react-native-async-storage/async-storage', () => {
  const storage: Record<string, string> = {};
  return {
    __esModule: true,
    default: {
      getItem: jest.fn(async (k: string) => storage[k] ?? null),
      setItem: jest.fn(async (k: string, v: string) => {
        storage[k] = v;
      }),
      removeItem: jest.fn(async (k: string) => {
        delete storage[k];
      }),
      clear: jest.fn(async () => {
        for (const k of Object.keys(storage)) delete storage[k];
      }),
    },
  };
});

global.__reanimatedWorkletInit = jest.fn();
