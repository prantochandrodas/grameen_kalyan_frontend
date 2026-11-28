'use client';

import { useEffect } from 'react';

// every lazy image starts downloading right after the page has loaded,
// and again for anything a new page / slider / API adds later
const makeEager = () => {
  document
    .querySelectorAll<HTMLImageElement>('img[loading="lazy"]')
    .forEach((img) => {
      img.loading = 'eager';
    });
};

const EagerImages = () => {
  useEffect(() => {
    let frame = 0;
    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        makeEager();
      });
    };

    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });

    const observer = new MutationObserver(() => {
      if (document.readyState === 'complete') schedule();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('load', schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return null;
};

export default EagerImages;