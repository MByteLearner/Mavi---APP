import { renderHook, act } from '@testing-library/react-native';
import { useHaptics } from '@/hooks/useHaptics';
import * as Haptics from 'expo-haptics';

describe('useHaptics', () => {
  it('exposes all feedback methods', () => {
    const { result } = renderHook(() => useHaptics());
    expect(typeof result.current.selection).toBe('function');
    expect(typeof result.current.light).toBe('function');
    expect(typeof result.current.medium).toBe('function');
    expect(typeof result.current.heavy).toBe('function');
    expect(typeof result.current.success).toBe('function');
    expect(typeof result.current.warning).toBe('function');
    expect(typeof result.current.error).toBe('function');
  });

  it('selection calls selectionAsync', () => {
    const { result } = renderHook(() => useHaptics());
    act(() => {
      result.current.selection();
    });
    expect(Haptics.selectionAsync).toHaveBeenCalled();
  });

  it('success calls notificationAsync with Success', () => {
    const { result } = renderHook(() => useHaptics());
    act(() => {
      result.current.success();
    });
    expect(Haptics.notificationAsync).toHaveBeenCalledWith('success');
  });

  it('error calls notificationAsync with Error', () => {
    const { result } = renderHook(() => useHaptics());
    act(() => {
      result.current.error();
    });
    expect(Haptics.notificationAsync).toHaveBeenCalledWith('error');
  });

  it('medium calls impactAsync with Medium', () => {
    const { result } = renderHook(() => useHaptics());
    act(() => {
      result.current.medium();
    });
    expect(Haptics.impactAsync).toHaveBeenCalledWith('medium');
  });
});
