import { useCallback } from 'react';

import { useBLEScale } from './useBLEScale';
import { useWeightSimulator } from './useWeightSimulator';
import type { WeightReading } from '@/types/ble';
import { useBLEStore } from '@/stores/useBLEStore';

export interface UseWeightSourceOptions {
  targetWeight: number;
  onReading: (reading: WeightReading) => void;
  /**
   * Force a specific source regardless of BLE state.
   * Defaults to "auto" which uses BLE if connected, otherwise the simulator.
   */
  source?: 'auto' | 'real' | 'simulator';
  enabled?: boolean;
  autoStartBLE?: boolean;
}

export function useWeightSource({
  targetWeight,
  onReading,
  source = 'auto',
  enabled = true,
  autoStartBLE = false,
}: UseWeightSourceOptions) {
  const bleStatus = useBLEStore((s) => s.status);

  const useReal = source === 'real' || (source === 'auto' && bleStatus === 'connected');

  const real = useBLEScale({ onReading, autoStart: autoStartBLE && useReal });
  const sim = useWeightSimulator({
    targetWeight,
    onReading,
    enabled: enabled && !useReal,
  });

  const startSimulation = useCallback(() => {
    sim.stop();
  }, [sim]);

  const stopSimulation = useCallback(() => {
    sim.stop();
  }, [sim]);

  return {
    source: useReal ? 'real' : 'simulator',
    isConnected: real.isConnected,
    isScanning: real.isScanning,
    deviceName: real.deviceName,
    error: real.error,
    scanAndConnect: real.scanAndConnect,
    disconnect: real.disconnect,
    startSimulation,
    stopSimulation,
  };
}
