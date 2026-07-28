import { useEffect, useRef, useCallback } from 'react';

import type { WeightReading } from '@/types/ble';

export interface UseWeightSimulatorOptions {
  targetWeight: number;
  totalSteps?: number;
  intervalMs?: number;
  noiseRange?: number;
  onReading: (reading: WeightReading) => void;
  enabled?: boolean;
}

export function useWeightSimulator({
  targetWeight,
  totalSteps = 30,
  intervalMs = 200,
  noiseRange = 0.4,
  onReading,
  enabled = true,
}: UseWeightSimulatorOptions) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentRef = useRef(0);
  const stepRef = useRef(0);
  const targetRef = useRef(targetWeight);
  const onReadingRef = useRef(onReading);

  useEffect(() => {
    onReadingRef.current = onReading;
  }, [onReading]);

  useEffect(() => {
    targetRef.current = targetWeight;
  }, [targetWeight]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    currentRef.current = 0;
    stepRef.current = 0;
  }, []);

  useEffect(() => {
    if (!enabled) {
      stop();
      return;
    }

    const stepSize = targetRef.current / totalSteps;
    currentRef.current = 0;
    stepRef.current = 0;

    intervalRef.current = setInterval(() => {
      const jitter = stepSize * (1 - noiseRange / 2 + Math.random() * noiseRange);
      currentRef.current = Math.min(currentRef.current + jitter, targetRef.current);
      stepRef.current += 1;

      const stable = stepRef.current >= totalSteps - 2;
      onReadingRef.current({
        grams: Math.round(currentRef.current * 10) / 10,
        timestamp: Date.now(),
        stable,
      });

      if (currentRef.current >= targetRef.current) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }, intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [targetWeight, totalSteps, intervalMs, noiseRange, enabled, stop]);

  return { stop };
}
