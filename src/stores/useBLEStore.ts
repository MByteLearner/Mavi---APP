import { create } from 'zustand';

export type BLEStatus =
  | 'idle'
  | 'scanning'
  | 'connecting'
  | 'connected'
  | 'error';

interface BLEState {
  status: BLEStatus;
  deviceName: string | null;
  error: string | null;
  setStatus: (status: BLEStatus) => void;
  setDeviceName: (name: string | null) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useBLEStore = create<BLEState>((set) => ({
  status: 'idle',
  deviceName: null,
  error: null,
  setStatus: (status) => set({ status }),
  setDeviceName: (deviceName) => set({ deviceName }),
  setError: (error) => set({ error, status: error ? 'error' : 'idle' }),
  reset: () => set({ status: 'idle', deviceName: null, error: null }),
}));
