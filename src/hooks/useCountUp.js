import { useEffect, useRef, useState } from 'react';

/**
 * Smoothly animates a number from its previous value to `target`.
 */
export function useCountUp(target, duration = 650) {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);

  useEffect(() => {
    const start = performance.now();
    const from = fromRef.current;
    const delta = target - from;
    if (delta === 0) return;

    let rafId;
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(from + delta * eased);
      setValue(current);
      if (t < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        fromRef.current = target;
      }
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [target, duration]);

  return value;
}
