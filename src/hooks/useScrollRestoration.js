import { useEffect } from 'react';

// Module-level so it survives across route changes without a full reload.
const scrollPositions = new Map();

export function useScrollRestoration(key) {
  useEffect(() => {
    function onScroll() {
      scrollPositions.set(key, window.scrollY);
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    const saved = scrollPositions.get(key) ?? 0;
    const raf = requestAnimationFrame(() => window.scrollTo(0, saved));

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [key]);
}
