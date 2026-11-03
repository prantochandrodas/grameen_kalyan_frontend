'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

import fallbackBackground from '@/assets/images/about/about-bg.webp';

import { Reveal, RevealText, useParallaxIntensity } from '../Motion';
import { toAbsoluteImageUrl } from '../Shared/aboutHelpers';
import { ArrowRightIcon } from '../Shared/icons';

import style from './parallaxHero.module.scss';

const {
  hero,
  media,
  mediaInner,
  bgImage,
  veil,
  content,
  eyebrow,
  headline,
  lineAccent,
  lead,
  actions,
  primaryCta,
  ghostCta,
  scrollHint,
  mouse,
  wheel,
} = style;

interface IParallaxHeroProps {
  backgroundImage?: string;
  titleOne?: string;
  titleTwo?: string;
  titleThree?: string;
}

const ParallaxHero = ({
  backgroundImage,
  titleOne = 'With Joy',
  titleTwo = 'We Grow Together',
  titleThree = 'We Serve Together',
}: IParallaxHeroProps) => {
  const ref = useRef<HTMLElement>(null);
  const intensity = useParallaxIntensity();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // background drifts down slower than the page (strongest layer)
  const bgRaw = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', `${9.6 * intensity}%`]
  );
  const bgY = useSpring(bgRaw, { stiffness: 90, damping: 28, mass: 0.5 });

  // foreground copy lifts and fades as the hero leaves
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -70 * intensity]);
  const copyOpacity = useTransform(
    scrollYProgress,
    [0, 0.7],
    [1, intensity ? 0 : 1]
  );

  const imageSrc = toAbsoluteImageUrl(backgroundImage) ?? fallbackBackground;

  return (
    <section ref={ref} className={hero} aria-label="About Grameen Kalyan">
      <div className={media}>
        <motion.div
          className={mediaInner}
          style={{ y: bgY, top: '-12%', bottom: '-12%' }}
        >
          <Image
            className={bgImage}
            src={imageSrc}
            alt=""
            fill
            priority
            sizes="100vw"
          />
        </motion.div>
        <div className={veil} />
      </div>

      <motion.div
        className={content}
        style={{ y: copyY, opacity: copyOpacity }}
      >

        <RevealText
          as="h1"
          className={headline}
          delay={0.25}
          stagger={0.09}
          lines={[
            { text: titleOne, className: lineAccent },
            { text: titleTwo },
            { text: titleThree },
          ]}
        />

        <Reveal as="p" className={lead} delay={0.9} distance={20}>
          Millions of People at Bottom of the Pyramid are Served with Empathy
          and Care
        </Reveal>

        <Reveal className={actions} delay={1.05} distance={20}>
          <Link href="#vision" className={primaryCta}>
            Explore Our Story
            <ArrowRightIcon />
          </Link>
          <Link href="/join-us" className={ghostCta}>
            Join Us
          </Link>
        </Reveal>
      </motion.div>
    </section>
  );
};

export default ParallaxHero;