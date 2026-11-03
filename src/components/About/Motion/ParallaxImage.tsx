'use client';

import React, { useRef } from 'react';
import Image, { StaticImageData } from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';

import { useParallaxIntensity } from './useParallaxIntensity';
import style from './parallaxImage.module.scss';

const { frame, layer } = style;

interface IParallaxImageProps {
  src: string | StaticImageData;
  alt: string;
  /** extra image height (in % of the frame) the picture may travel. 0 = static */
  depth?: number;
  sizes?: string;
  priority?: boolean;
  /** CSS object-position, e.g. "center 20%" */
  position?: string;
  className?: string;
  imageClassName?: string;
  /** overlays rendered above the picture */
  children?: React.ReactNode;
}

/**
 * Image that drifts slower than the page while its frame scrolls through the
 * viewport. Only transform is animated. Disabled on phones and for
 * prefers-reduced-motion, reduced to half strength on tablets.
 */
const ParallaxImage = ({
  src,
  alt,
  depth = 10,
  sizes = '100vw',
  priority = false,
  position = 'center',
  className,
  imageClassName,
  children,
}: IParallaxImageProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const intensity = useParallaxIntensity();

  const effective = depth * intensity;
  // % of the (taller) layer so the image never uncovers the frame edges
  const travel = (effective / (100 + 2 * effective)) * 100;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`${-travel}%`, `${travel}%`]
  );

  return (
    <div ref={ref} className={`${frame} ${className ?? ''}`.trim()}>
      <motion.div
        className={layer}
        style={{ y, top: `-${effective}%`, bottom: `-${effective}%` }}
      >
        <Image
          className={imageClassName}
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          style={{ objectFit: 'cover', objectPosition: position }}
        />
      </motion.div>
      {children}
    </div>
  );
};

export default ParallaxImage;