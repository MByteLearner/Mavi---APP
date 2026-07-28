import { renderHook, act } from '@testing-library/react-native';
import { useBLEStore } from '@/stores/useBLEStore';

describe('useBLEStore', () => {
  beforeEach(() => {
    useBLEStore.setState({ status: 'idle', deviceName: null, error: null });
  });

  it('setStatus updates the connection status', () => {
    const { result } = renderHook(() => useBLEStore());
    act(() => {
      result.current.setStatus('scanning');
    });
    expect(useBLEStore.getState().status).toBe('scanning');
  });

  it('setDeviceName persists the device name', () => {
    useBLEStore.getState().setDeviceName('MAVI_SCALE');
    expect(useBLEStore.getState().deviceName).toBe('MAVI_SCALE');
  });

  it('setError stores the error code and flips to error status', () => {
    useBLEStore.getState().setError('off');
    const s = useBLEStore.getState();
    expect(s.error).toBe('off');
    expect(s.status).toBe('error');
  });

  it('setError(null) clears error and returns to idle', () => {
    useBLEStore.getState().setError('off');
    useBLEStore.getState().setError(null);
    const s = useBLEStore.getState();
    expect(s.error).toBeNull();
    expect(s.status).toBe('idle');
  });

  it('reset clears all state', () => {
    useBLEStore.getState().setStatus('connected');
    useBLEStore.getState().setDeviceName('X');
    useBLEStore.getState().reset();
    const s = useBLEStore.getState();
    expect(s.status).toBe('idle');
    expect(s.deviceName).toBeNull();
  });
});
