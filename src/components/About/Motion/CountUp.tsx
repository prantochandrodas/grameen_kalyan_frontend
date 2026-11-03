'use client';

import React, { useEffect, useRef } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';

interface ICountUpProps {
  value: string | number;
  duration?: number;
  delay?: number;
  /** forces a suffix (e.g. "+") instead of the one found in `value` */
  suffix?: string;
  className?: string;
}

/**
 * Counts from 0 to the number found in `value` once it scrolls into view.
 * Understands "750,000", 750000, "5,250", "12.5%", "$20" and leaves plain
 * years (1996) untouched. Writes straight to the DOM, so no React re-renders
 * happen while counting.
 */
const CountUp = ({
  value,
  duration = 2,
  delay = 0,
  suffix,
  className,
}: ICountUpProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduceMotion = useReducedMotion();

  const raw = String(value ?? '');
  const match = raw.match(/^(\D*)([\d,.]+)(.*)$/);
  const prefix = match?.[1] ?? '';
  const target = match ? parseFloat(match[2].replace(/,/g, '')) : NaN;
  const tail = suffix ?? match?.[3] ?? '';
  const decimals = match?.[2].includes('.') ? match[2].split('.')[1].length : 0;
  const isYear = target >= 1900 && target <= 2100 && !tail;
  const isStatic = Number.isNaN(target) || isYear;

  const format = (n: number) =>
    `${prefix}${n.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${tail}`;

  useEffect(() => {
    const node = ref.current;
    if (!inView || isStatic || !node) return undefined;

    if (reduceMotion) {
      node.textContent = format(target);
      return undefined;
    }

    const controls = animate(0, target, {
      duration,
      delay,
      ease: 'easeOut',
      onUpdate: (latest) => {
        node.textContent = format(latest);
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, isStatic, target, duration, delay, tail, reduceMotion]);

  return (
    <span ref={ref} className={className}>
      {isStatic ? raw : format(0)}
    </span>
  );
};

export default CountUp;