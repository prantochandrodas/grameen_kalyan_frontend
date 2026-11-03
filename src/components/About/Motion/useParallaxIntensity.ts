'use client';

import { useEffect, useState } from 'react';

/**
 * How strong scroll-parallax should be for the current device.
 *  0   -> off  (phones, reduced-motion users, first render / SSR)
 *  0.5 -> tablet
 *  1   -> desktop
 * Uses matchMedia change events only (no scroll / resize listeners).
 */
export const useParallaxIntensity = (): number => {
  const [intensity, setIntensity] = useState(0);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1025px)');
    const tablet = window.matchMedia('(min-width: 768px)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    const update = () => {
      if (reduced.matches) setIntensity(0);
      else if (desktop.matches) setIntensity(1);
      else if (tablet.matches) setIntensity(0.5);
      else setIntensity(0);
    };

    update();
    const queries = [desktop, tablet, reduced];
    queries.forEach((mq) => mq.addEventListener('change', update));
    return () =>
      queries.forEach((mq) => mq.removeEventListener('change', update));
  }, []);

  return intensity;
};

export default useParallaxIntensity;