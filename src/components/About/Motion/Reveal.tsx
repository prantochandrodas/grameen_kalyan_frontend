'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';

import { EASE } from './motion.config';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';
type RevealTag = 'div' | 'li' | 'p' | 'span' | 'h2' | 'h3';
type GroupTag = 'div' | 'ul' | 'ol';

const TAGS = {
  div: motion.div,
  li: motion.li,
  p: motion.p,
  span: motion.span,
  h2: motion.h2,
  h3: motion.h3,
} as const;

const GROUP_TAGS = {
  div: motion.div,
  ul: motion.ul,
  ol: motion.ol,
} as const;

const offsetFor = (direction: Direction, distance: number) => {
  switch (direction) {
    case 'up':
      return { y: distance };
    case 'down':
      return { y: -distance };
    case 'left':
      return { x: distance };
    case 'right':
      return { x: -distance };
    default:
      return {};
  }
};

interface IRevealProps {
  children?: React.ReactNode;
  className?: string;
  as?: RevealTag;
  delay?: number;
  duration?: number;
  distance?: number;
  direction?: Direction;
  amount?: number;
}

/** Fade + slide in once, when the element enters the viewport */
export const Reveal = ({
  children,
  className,
  as = 'div',
  delay = 0,
  duration = 0.8,
  distance = 32,
  direction = 'up',
  amount = 0.15,
}: IRevealProps) => {
  const Tag = TAGS[as] as typeof motion.div;

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, ...offsetFor(direction, distance) }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
};

interface IRevealGroupProps {
  children?: React.ReactNode;
  className?: string;
  as?: GroupTag;
  stagger?: number;
  delay?: number;
  amount?: number;
}

/** Container that staggers its <RevealItem> children */
export const RevealGroup = ({
  children,
  className,
  as = 'div',
  stagger = 0.12,
  delay = 0,
  amount = 0.15,
}: IRevealGroupProps) => {
  const Tag = GROUP_TAGS[as] as typeof motion.div;
  const variants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };

  return (
    <Tag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
    >
      {children}
    </Tag>
  );
};

interface IRevealItemProps {
  children?: React.ReactNode;
  className?: string;
  as?: RevealTag;
  duration?: number;
  distance?: number;
  direction?: Direction;
}

export const RevealItem = ({
  children,
  className,
  as = 'div',
  duration = 0.8,
  distance = 36,
  direction = 'up',
}: IRevealItemProps) => {
  const Tag = TAGS[as] as typeof motion.div;
  const variants: Variants = {
    hidden: { opacity: 0, ...offsetFor(direction, distance) },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration, ease: EASE },
    },
  };

  return (
    <Tag className={className} variants={variants}>
      {children}
    </Tag>
  );
};