import { useEffect, useRef, useState } from 'react';

export default function CountUp({ value, suffix = '', decimals = 0, duration = 1100, delay = 250 }) {
  const [display, setDisplay] = useState(0);
  const frame = useRef(null);

  useEffect(() => {
    let start;
    const timer = setTimeout(() => {
      function tick(now) {
        if (!start) start = now;
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(value * eased);
        if (p < 1) frame.current = requestAnimationFrame(tick);
      }
      frame.current = requestAnimationFrame(tick);
    }, delay);
    return () => {
      clearTimeout(timer);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [value, duration, delay]);

  return <>{display.toFixed(decimals)}{suffix}</>;
}
