'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';

import { EASE } from './motion.config';
import style from './revealText.module.scss';

const { line, mask, word } = style;

const TAGS = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
} as const;

export interface IRevealTextLine {
  text: string;
  className?: string;
}

interface IRevealTextProps {
  lines: IRevealTextLine[];
  as?: keyof typeof TAGS;
  className?: string;
  delay?: number;
  stagger?: number;
}

/**
 * Headline reveal: every word slides up out of an overflow mask.
 * Each entry of `lines` renders on its own line and can carry its own class.
 */
const RevealText = ({
  lines,
  as = 'h2',
  className,
  delay = 0,
  stagger = 0.07,
}: IRevealTextProps) => {
  const Tag = TAGS[as] as typeof motion.h2;

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  const wordVariants: Variants = {
    hidden: { y: '115%' },
    visible: { y: '0%', transition: { duration: 0.9, ease: EASE } },
  };

  return (
    <Tag
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
    >
      {lines
        .filter((item) => item.text)
        .map((item, lineIndex) => {
          const words = item.text.trim().split(/\s+/);
          return (
            <span
              key={`${lineIndex}-${item.text}`}
              className={`${line} ${item.className ?? ''}`.trim()}
            >
              {words.map((w, i) => (
                <React.Fragment key={`${i}-${w}`}>
                  <span className={mask}>
                    <motion.span className={word} variants={wordVariants}>
                      {w}
                    </motion.span>
                  </span>
                  {i < words.length - 1 ? ' ' : ''}
                </React.Fragment>
              ))}
            </span>
          );
        })}
    </Tag>
  );
};

export default RevealText;