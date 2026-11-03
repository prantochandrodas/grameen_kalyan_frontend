'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

import { useParallaxIntensity } from './useParallaxIntensity';

interface IParallaxLayerProps {
  children?: React.ReactNode;
  /** wrapper class (position / size of the decorative layer) */
  className?: string;
  /** travel in px from the moment it enters until it leaves the viewport */
  distance?: number;
  /** move the opposite way */
  reverse?: boolean;
}

/**
 * Decorative depth layer (leaves, frames, shapes). Moves at its own speed
 * relative to the page. Does nothing on phones / reduced motion.
 */
const ParallaxLayer = ({
  children,
  className,
  distance = 80,
  reverse = false,
}: IParallaxLayerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const intensity = useParallaxIntensity();
  const travel = distance * intensity * (reverse ? -1 : 1);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-travel, travel]);

  return (
    <div ref={ref} className={className} aria-hidden="true">
      <motion.div style={{ y, height: '100%', width: '100%' }}>
        {children}
      </motion.div>
    </div>
  );
};

export default ParallaxLayer;