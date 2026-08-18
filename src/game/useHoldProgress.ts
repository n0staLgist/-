import { useCallback, useEffect, useRef, useState } from 'react';

export function useHoldProgress(enabled: boolean, durationMs: number) {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const holdingRef = useRef(false);

  const start = useCallback(() => {
    if (!enabled || progress >= 100) return;
    holdingRef.current = true;
    setIsHolding(true);
  }, [enabled, progress]);
  const stop = useCallback(() => {
    holdingRef.current = false;
    setIsHolding(false);
  }, []);

  useEffect(() => {
    const keyDown = (event: KeyboardEvent) => {
      if (event.repeat || (event.code !== 'KeyE' && event.code !== 'Space')) return;
      event.preventDefault();
      start();
    };
    const keyUp = (event: KeyboardEvent) => {
      if (event.code === 'KeyE' || event.code === 'Space') stop();
    };
    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);
    window.addEventListener('blur', stop);
    return () => {
      window.removeEventListener('keydown', keyDown);
      window.removeEventListener('keyup', keyUp);
      window.removeEventListener('blur', stop);
    };
  }, [start, stop]);

  useEffect(() => {
    if (!enabled) return stop();
    let frame = 0;
    let previous = performance.now();
    const tick = (time: number) => {
      if (holdingRef.current) {
        const delta = Math.min(time - previous, 40);
        setProgress((current) => Math.min(100, current + delta / durationMs * 100));
      }
      previous = time;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [durationMs, enabled, stop]);

  useEffect(() => {
    if (progress >= 100) stop();
  }, [progress, stop]);

  return { progress, isHolding, start, stop };
}
