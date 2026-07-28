import { useCallback, useEffect, useRef } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import {
  BleManager,
  State,
  type Device,
  type Subscription,
  type State as BleStateT,
} from 'react-native-ble-plx';

import { BLE_CONSTANTS } from '@/constants/ble';
import { useBLEStore } from '@/stores/useBLEStore';
import { logger } from '@/utils/logger';
import type { WeightReading } from '@/types/ble';

let managerInstance: BleManager | null = null;

function getManager(): BleManager {
  if (!managerInstance) {
    managerInstance = new BleManager();
  }
  return managerInstance;
}

async function requestAndroidPermissions(): Promise<boolean> {
  if (Platform.OS !== 'android') return true;
  const permissions = [
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  ];
  const results = await PermissionsAndroid.requestMultiple(permissions);
  return Object.values(results).every((r) => r === PermissionsAndroid.RESULTS.GRANTED);
}

function parseWeightPayload(base64: string): number | null {
  try {
    const bytes = base64ToBytes(base64);
    if (bytes.length < 2) return null;
    const low = bytes[0] ?? 0;
    const high = bytes[1] ?? 0;
    return (low | (high << 8)) / 10;
  } catch {
    return null;
  }
}

function base64ToBytes(base64: string): number[] {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const lookup: Record<string, number> = {};
  for (let i = 0; i < alphabet.length; i++) lookup[alphabet[i]!] = i;

  const clean = base64.replace(/=+$/, '');
  const bytes: number[] = [];
  for (let i = 0; i < clean.length; i += 4) {
    const a = lookup[clean[i]!] ?? 0;
    const b = lookup[clean[i + 1]!] ?? 0;
    const c = lookup[clean[i + 2] ?? 'A'] ?? 0;
    const d = lookup[clean[i + 3] ?? 'A'] ?? 0;
    bytes.push((a << 2) | (b >> 4));
    if (clean[i + 2] !== undefined) bytes.push(((b & 15) << 4) | (c >> 2));
    if (clean[i + 3] !== undefined) bytes.push(((c & 3) << 6) | d);
  }
  return bytes;
}

export interface UseBLEScaleOptions {
  onReading: (reading: WeightReading) => void;
  autoStart?: boolean;
}

export function useBLEScale({ onReading, autoStart = false }: UseBLEScaleOptions) {
  const status = useBLEStore((s) => s.status);
  const deviceName = useBLEStore((s) => s.deviceName);
  const error = useBLEStore((s) => s.error);
  const setStatus = useBLEStore((s) => s.setStatus);
  const setDeviceName = useBLEStore((s) => s.setDeviceName);
  const setError = useBLEStore((s) => s.setError);
  const reset = useBLEStore((s) => s.reset);

  const deviceRef = useRef<Device | null>(null);
  const subscriptionRef = useRef<Subscription | null>(null);
  const onReadingRef = useRef(onReading);
  const scanAndConnectRef = useRef<(() => Promise<boolean | undefined>) | null>(null);

  useEffect(() => {
    onReadingRef.current = onReading;
  }, [onReading]);

  const disconnect = useCallback(async () => {
    if (subscriptionRef.current) {
      subscriptionRef.current.remove();
      subscriptionRef.current = null;
    }
    if (deviceRef.current) {
      try {
        await deviceRef.current.cancelConnection();
      } catch (err) {
        logger.warn('ble', 'cancelConnection error', { error: String(err) });
      }
      deviceRef.current = null;
    }
    reset();
  }, [reset]);

  const subscribeToWeight = useCallback(
    async (device: Device) => {
      try {
        const subscription = device.monitorCharacteristicForService(
          BLE_CONSTANTS.DEFAULT_SERVICE_UUID,
          BLE_CONSTANTS.WEIGHT_CHARACTERISTIC_UUID,
          (err, characteristic) => {
            if (err) {
              logger.error('ble', 'monitorCharacteristic error', { error: err.message });
              return;
            }
            if (!characteristic?.value) return;
            const grams = parseWeightPayload(characteristic.value);
            if (grams === null) return;
            onReadingRef.current({
              grams,
              timestamp: Date.now(),
              stable: true,
            });
          },
        );
        subscriptionRef.current = subscription;
      } catch (err) {
        logger.error('ble', 'subscribeToWeight error', { error: String(err) });
        setError('No se pudo suscribir a la característica de peso');
      }
    },
    [setError],
  );

  const scanAndConnect = useCallback(async () => {
    setError(null);
    setStatus('scanning');

    const hasPermission = await requestAndroidPermissions();
    if (!hasPermission) {
      setError('permissions');
      return;
    }

    const manager = getManager();
    const bleState: BleStateT = await manager.state();
    if (bleState !== State.PoweredOn) {
      setError('off');
      return;
    }

    return new Promise<boolean>((resolve) => {
      let foundDevice: Device | null = null;
      const timeout = setTimeout(() => {
        manager.stopDeviceScan();
        if (!foundDevice) {
          setStatus('idle');
          setError('not_found');
          resolve(false);
        }
      }, BLE_CONSTANTS.SCAN_TIMEOUT_MS);

      manager.startDeviceScan(null, null, async (scanError, scannedDevice) => {
        if (scanError) {
          clearTimeout(timeout);
          manager.stopDeviceScan();
          setError('scan_failed');
          logger.error('ble', 'scan error', { error: scanError.message });
          resolve(false);
          return;
        }
        if (!scannedDevice || scannedDevice.name !== BLE_CONSTANTS.DEVICE_NAME) return;
        if (foundDevice) return;

        foundDevice = scannedDevice;
        clearTimeout(timeout);
        manager.stopDeviceScan();
        setStatus('connecting');

        try {
          const connected = await scannedDevice.connect();
          await connected.discoverAllServicesAndCharacteristics();
          deviceRef.current = connected;
          setDeviceName(connected.name ?? BLE_CONSTANTS.DEVICE_NAME);
          setStatus('connected');

          connected.onDisconnected(() => {
            logger.info('ble', 'device disconnected');
            deviceRef.current = null;
            setStatus('idle');
            setDeviceName(null);
            if (BLE_CONSTANTS.AUTO_RECONNECT) {
              setTimeout(() => {
                scanAndConnectRef.current?.().catch((err) =>
                  logger.error('ble', 'reconnect error', { error: String(err) }),
                );
              }, BLE_CONSTANTS.RECONNECT_DELAY_MS);
            }
          });

          await subscribeToWeight(connected);
          resolve(true);
        } catch (err) {
          logger.error('ble', 'connect error', { error: String(err) });
          setError('connect_failed');
          setStatus('idle');
          resolve(false);
        }
      });
    });
  }, [setError, setStatus, setDeviceName, subscribeToWeight]);

  useEffect(() => {
    scanAndConnectRef.current = scanAndConnect;
  }, [scanAndConnect]);

  useEffect(() => {
    if (autoStart) {
      scanAndConnect().catch((err) =>
        logger.error('ble', 'autoStart scan error', { error: String(err) }),
      );
    }
    return () => {
      disconnect().catch(() => undefined);
    };
  }, [autoStart, scanAndConnect, disconnect]);

  return {
    status,
    deviceName,
    error,
    isConnected: status === 'connected',
    isScanning: status === 'scanning' || status === 'connecting',
    scanAndConnect,
    disconnect,
  };
}
