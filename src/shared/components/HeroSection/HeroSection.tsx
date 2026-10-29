'use client';

import React from 'react';
import Image from 'next/image';
import { motion, MotionConfig } from 'framer-motion';

import bgImg from '@/assets/images/about/about-bg.webp';

import style from './heroSection.module.scss';

const {
  heroSection,
  bgImageContainer,
  bgImage,
  content,
  heading,
  juSubHeading,
  juHeading,
  juContent,
  healthcareContent,
  healthcareSubHeading,
  healthcareHeading,
  storyHeading,
  storyContent,
} = style;

interface IHeroSectionProps {
  heroFor?: string;
  backgroundImage?: string;
  titleOne?: string;
  titleTwo?: string;
  titleThree?: string;
  title?: string;
  subtitle?: string;
  imagePosition?: string; // e.g. 'center 60%' to move the crop focus
}

const DEFAULT_TITLE_LINES = ['How People & Culture Thrive In', 'Grameen Kalyan'];
const DEFAULT_SUBTITLE_LINES = [
  'Be inspired to serve the people',
  'across the nation',
];

// text ke word boundary te bhenge line baniye dey (max maxChars char per line)
const splitIntoLines = (text: string, maxChars = 32): string[] => {
  const lines: string[] = [];
  let current = '';

  text
    .trim()
    .split(/\s+/)
    .forEach((word) => {
      const next = current ? `${current} ${word}` : word;
      if (current && next.length > maxChars) {
        lines.push(current);
        current = word;
      } else {
        current = next;
      }
    });

  if (current) lines.push(current);
  return lines;
};

// Shared background image: fills the 16:5 box, no blur-hack, loads first (LCP)
const HeroBackground = ({
  src,
  position = 'center 30%',
}: {
  src?: string;
  position?: string;
}) => (
  <div className={bgImageContainer}>
    <Image
      className={bgImage}
      style={{ objectPosition: position }}
      src={src || bgImg}
      alt=""
      fill
      priority
      sizes="100vw"
    />
  </div>
);

const HeroContent = ({
  heroFor,
  backgroundImage,
  titleOne,
  titleTwo,
  titleThree,
  title,
  subtitle,
  imagePosition,
}: IHeroSectionProps) => {
  const isJoinUs = heroFor === 'join-us' || heroFor === 'search';
  const isHealthcare = heroFor === 'healthcare';
  const isStory = heroFor === 'story';
  if (isJoinUs) {
    return (
      <div className={heroSection}>
        <HeroBackground src={backgroundImage} position={imagePosition} />
        <div className={`${content} ${juContent}`}>
          <motion.h1
            style={{ position: 'relative' }}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            className={juSubHeading}
          >
            {(title ? splitIntoLines(title) : DEFAULT_TITLE_LINES).map(
              (line, i) => (
                <span key={`${i}-${line}`}>{line}</span>
              )
            )}
          </motion.h1>
          <motion.p
            style={{ position: 'relative' }}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            className={juHeading}
          >
            {(subtitle ? splitIntoLines(subtitle) : DEFAULT_SUBTITLE_LINES).map(
              (line, i) => (
                <span key={`${i}-${line}`}>{line}</span>
              )
            )}
          </motion.p>
        </div>
      </div>
    );
  }
  if (isHealthcare) {
    return (
      <div className={heroSection}>
        <HeroBackground src={backgroundImage} position={imagePosition} />
        <div className={`${content} ${healthcareContent}`}>
          <motion.h1
            style={{ position: 'relative' }}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            className={healthcareSubHeading}
          >
            <span>Serving People with</span>
            <span>Empathy</span>
          </motion.h1>
          <motion.div
            style={{ position: 'relative' }}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            className={healthcareHeading}
          >
            <span>Quality &</span>
            <span>Trust</span>
          </motion.div>
        </div>
      </div>
    );
  }
  if (isStory) {
    return (
      <div className={heroSection}>
        <HeroBackground src={backgroundImage} position={imagePosition} />
        <div className={`${content} ${storyContent}`}>
          <motion.h1
            style={{ position: 'relative' }}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            className={storyHeading}
          >
            <span>{titleOne}</span>
            <span>{titleTwo}</span>
          </motion.h1>
        </div>
      </div>
    );
  }

  return (
    <div className={heroSection}>
      <HeroBackground src={backgroundImage} position={imagePosition} />
      <div className={content}>
        <motion.h1
          style={{ position: 'relative' }}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className={heading}
        >
          <span>{titleOne}</span>
          <span>{titleTwo}</span>
          <span>{titleThree}</span>
        </motion.h1>
      </div>
    </div>
  );
};

const HeroSection = (props: IHeroSectionProps) => (
  <MotionConfig reducedMotion="user">
    <HeroContent {...props} />
  </MotionConfig>
);

export default HeroSection;