'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';

import { IMAGE_BASE_URL } from '@/config';

import style from './heroSection.module.scss';
import { IHeroSectionData } from './HeroSection.types';

const {
  hero,
  media,
  mediaInner,
  bgImage,
  veil,
  content,
  eyebrow,
  bar,
  headline,
  lineAccent,
} = style;

interface IHeroSectionProps {
  data: IHeroSectionData;
}

const HeroSection = ({ data }: IHeroSectionProps) => {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const intensity = reduceMotion ? 0 : 1;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // background drifts slower than the page
  const bgRaw = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', `${9.6 * intensity}%`]
  );
  const bgY = useSpring(bgRaw, { stiffness: 90, damping: 28, mass: 0.5 });

  // copy lifts and fades while the hero leaves the screen
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -70 * intensity]);
  const copyOpacity = useTransform(
    scrollYProgress,
    [0, 0.7],
    [1, intensity ? 0 : 1]
  );

  const src = data?.image ? IMAGE_BASE_URL + data.image : null;

  // last word of the title gets the gold accent
  const words = (data?.title ?? '').trim().split(/\s+/).filter(Boolean);
  const accentWord = words.length > 1 ? words.pop() : null;
  const firstPart = words.join(' ');

  return (
    <section ref={ref} className={hero} aria-label={data?.title || 'Story'}>
      <div className={media}>
        <motion.div
          className={mediaInner}
          style={{ y: bgY, top: '-12%', bottom: '-12%' }}
        >
          {src ? (
            <Image
              className={bgImage}
              src={src}
              alt=""
              fill
              priority
              sizes="100vw"
            />
          ) : null}
        </motion.div>
        <div className={veil} />
      </div>

      <motion.div
        className={content}
        style={{ y: copyY, opacity: copyOpacity }}
      >
        {/* <p className={eyebrow}>Our Stories</p> */}
        <span className={bar} aria-hidden="true" />
        <motion.h1
          className={headline}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {firstPart}
          {accentWord ? (
            <>
              {firstPart ? ' ' : ''}
              <span className={lineAccent}>{accentWord}</span>
            </>
          ) : null}
        </motion.h1>
      </motion.div>
    </section>
  );
};

export default HeroSection;