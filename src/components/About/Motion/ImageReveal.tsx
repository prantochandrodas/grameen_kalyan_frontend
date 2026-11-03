'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

import { EASE } from './motion.config';

interface IImageRevealProps {
  children?: React.ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Clip-path "curtain" reveal with a soft zoom-out of the picture.
 * The wrapper (className) must be sized by the parent, e.g. absolutely
 * positioned with inset: 0.
 *
 * The in-view observer sits on the unclipped wrapper: an element whose
 * clip-path hides it fully never intersects the viewport, so observing the
 * clipped element itself would never fire.
 */
const ImageReveal = ({ children, className, delay = 0 }: IImageRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <div ref={ref} className={className}>
      <motion.div
        style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}
        initial={{ clipPath: 'inset(0 0 100% 0)' }}
        animate={{ clipPath: inView ? 'inset(0 0 0% 0)' : 'inset(0 0 100% 0)' }}
        transition={{ duration: 1, delay, ease: EASE }}
      >
        <motion.div
          style={{ position: 'absolute', inset: 0 }}
          initial={{ scale: 1.22 }}
          animate={{ scale: inView ? 1 : 1.22 }}
          transition={{ duration: 1.4, delay, ease: EASE }}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ImageReveal;