import { renderHook, act } from '@testing-library/react-native';
import { useWeightSimulator } from '@/hooks/useWeightSimulator';
import type { WeightReading } from '@/types/ble';

describe('useWeightSimulator', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('emits readings that approach the target weight', () => {
    const readings: WeightReading[] = [];
    const onReading = (r: WeightReading) => readings.push(r);

    renderHook(() =>
      useWeightSimulator({ targetWeight: 100, totalSteps: 5, intervalMs: 100, onReading }),
    );

    act(() => {
      jest.advanceTimersByTime(700);
    });

    expect(readings.length).toBeGreaterThan(0);
    const last = readings[readings.length - 1]!;
    expect(last.grams).toBeGreaterThan(0);
    expect(last.grams).toBeLessThanOrEqual(100);
  });

  it('marks the final reading as stable', () => {
    const readings: WeightReading[] = [];
    const onReading = (r: WeightReading) => readings.push(r);

    renderHook(() =>
      useWeightSimulator({ targetWeight: 50, totalSteps: 3, intervalMs: 100, onReading }),
    );

    act(() => {
      jest.advanceTimersByTime(500);
    });

    const last = readings[readings.length - 1];
    expect(last?.stable).toBe(true);
  });

  it('does not emit when disabled', () => {
    const readings: WeightReading[] = [];
    const onReading = (r: WeightReading) => readings.push(r);

    renderHook(() =>
      useWeightSimulator({ targetWeight: 50, intervalMs: 100, onReading, enabled: false }),
    );

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(readings.length).toBe(0);
  });

  it('stop() prevents further emissions', () => {
    const readings: WeightReading[] = [];
    const onReading = (r: WeightReading) => readings.push(r);

    const { result } = renderHook(() =>
      useWeightSimulator({ targetWeight: 100, totalSteps: 50, intervalMs: 100, onReading }),
    );

    act(() => {
      jest.advanceTimersByTime(300);
    });
    const countBefore = readings.length;

    act(() => {
      result.current.stop();
      jest.advanceTimersByTime(1000);
    });

    expect(readings.length).toBe(countBefore);
  });
});
