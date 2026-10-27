'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

import bgImg from '@/assets/images/about/about-bg.webp';
import layoutImg from '@/assets/layout/layout-tr-small.svg';

import style from './heroSection.module.scss';

const {
  heroSection,
  bgImageContainer,
  bgImage,
  content,
  heading,
  layoutContainer,
  layoutImage,
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

const HeroSection = ({
  heroFor,
  backgroundImage,
  titleOne,
  titleTwo,
  titleThree,
  title,
  subtitle,
}: IHeroSectionProps) => {
  const isJoinUs = heroFor === 'join-us' || 'search';
  const isHealthcare = heroFor === 'healthcare';
  const isStory = heroFor === 'story';
  console.log(backgroundImage);
  if (isJoinUs) {
    return (
      <div className={heroSection}>
        <div className={bgImageContainer}>
          <Image
            className={bgImage}
            src={backgroundImage || bgImg}
            alt="bg img"
            width={10000}
            height={10000}
            placeholder="blur"
            blurDataURL={`${backgroundImage}` || `${bgImg}`}
          />
        </div>
        <div className={`${content} ${juContent}`}>
          <motion.h1
            style={{ position: 'relative' }}
            initial={{ opacity: 0, bottom: '-5rem' }}
            whileInView={{ opacity: 1, bottom: '0' }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={juSubHeading}
          >
            {(title ? splitIntoLines(title) : DEFAULT_TITLE_LINES).map(
              (line) => (
                <span key={line}>{line}</span>
              )
            )}
          </motion.h1>
          <motion.h1
            style={{ position: 'relative' }}
            initial={{ opacity: 0, bottom: '-5rem' }}
            whileInView={{ opacity: 1, bottom: '0' }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={juHeading}
          >
            {(subtitle ? splitIntoLines(subtitle) : DEFAULT_SUBTITLE_LINES).map(
              (line) => (
                <span key={line}>{line}</span>
              )
            )}
          </motion.h1>
          <div className={layoutContainer}>
            <Image className={layoutImage} src={layoutImg} alt="layout" />
          </div>
        </div>
      </div>
    );
  }
  if (isHealthcare) {
    return (
      <div className={heroSection}>
        <div className={bgImageContainer}>
          <Image
            className={bgImage}
            src={backgroundImage || bgImg}
            alt="bg img"
            width={10000}
            height={10000}
            placeholder="blur"
            blurDataURL={`${backgroundImage}` || `${bgImg}`}
          />
        </div>
        <div className={`${content} ${healthcareContent}`}>
          <motion.h1
            style={{ position: 'relative' }}
            initial={{ opacity: 0, bottom: '-5rem' }}
            whileInView={{ opacity: 1, bottom: '0' }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={healthcareSubHeading}
          >
            <span>Serving People with</span>
            <span>Empathy</span>
          </motion.h1>
          <motion.h1
            style={{ position: 'relative' }}
            initial={{ opacity: 0, bottom: '-5rem' }}
            whileInView={{ opacity: 1, bottom: '0' }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={healthcareHeading}
          >
            <span>Quality &</span>
            <span>Trust</span>
          </motion.h1>
          <div className={layoutContainer}>
            <Image className={layoutImage} src={layoutImg} alt="layout" />
          </div>
        </div>
      </div>
    );
  }
  if (isStory) {
    return (
      <div className={heroSection}>
        <div className={bgImageContainer}>
          <Image
            className={bgImage}
            src={backgroundImage || bgImg}
            alt="bg img"
            width={10000}
            height={10000}
            placeholder="blur"
            blurDataURL={`${backgroundImage}` || `${bgImg}`}
          />
        </div>
        <div className={`${content} ${storyContent}`}>
          <motion.h1
            style={{ position: 'relative' }}
            initial={{ opacity: 0, bottom: '-5rem' }}
            whileInView={{ opacity: 1, bottom: '0' }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={storyHeading}
          >
            <span>{titleOne}</span>
            <span>{titleTwo}</span>
          </motion.h1>
          <div className={layoutContainer}>
            <Image className={layoutImage} src={layoutImg} alt="layout" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={heroSection}>
      <div className={bgImageContainer}>
        <Image
          className={bgImage}
          src={backgroundImage || bgImg}
          alt="bg img"
          width={1000}
          height={1000}
          placeholder="blur"
          blurDataURL={`${backgroundImage}` || `${bgImg}`}
        />
      </div>
      <div className={content}>
        <motion.h1
          style={{ position: 'relative' }}
          initial={{ opacity: 0, bottom: '-5rem' }}
          whileInView={{ opacity: 1, bottom: '0' }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={heading}
        >
          <span>{titleOne}</span>
          <span>{titleTwo}</span>
          <span>{titleThree}</span>
        </motion.h1>
        <div className={layoutContainer}>
          <Image className={layoutImage} src={layoutImg} alt="layout" />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;