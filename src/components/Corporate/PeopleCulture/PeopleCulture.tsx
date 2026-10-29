'use client';

import React from 'react';
import Image from 'next/image';
import { motion, MotionConfig } from 'framer-motion';

import layoutLT from '@/assets/layout/grid-top-leaf.svg';
import layoutRB from '@/assets/layout/grid-bottom-leaf.svg';

import style from './peopleCulture.module.scss';

const {
  peopleCulture,
  layoutLeft,
  layoutRight,
  img,
  container,
  header,
  heading,
  highlight,
  lead,
  grid,
  card,
  badge,
  text,
} = style;

const LEAD =
  'Human resource management is the strategic approach to the effective and efficient management of people in a company or organization such that they help their business gain a competitive advantage.';

const POINTS = [
  'The culture at Grameen Kalyan provides a strategic competitive advantage, beliefs and values widely shared and firmly upheld.',
  'With more effective implementation of quality improvement efforts and information systems development day by day, Kalyan provides better service and community-based primary healthcare across the country.',
  'We promote enhanced trust and cooperation, more efficient decisions, fewer disagreements, and focus on the organisation and its goals.',
  "With a strong sense of identification and a shared understanding of essential in Kalyan's goal, we want to serve people in the rural areas effectively and efficiently.",
];

const PeopleCulture = () => {
  return (
    <MotionConfig reducedMotion="user">
    <section className={peopleCulture}>
      <div className={layoutLeft} aria-hidden="true">
        <Image className={img} src={layoutLT} alt="" />
      </div>
      <div className={layoutRight} aria-hidden="true">
        <Image className={img} src={layoutRB} alt="" />
      </div>

      <div className={container}>
        <motion.header
          className={header}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={heading}>
            People & <span className={highlight}>Culture</span>
          </h2>
          <p className={lead}>{LEAD}</p>
        </motion.header>

        <div className={grid}>
          {POINTS.map((point, i) => (
            <motion.article
              key={i}
              className={card}
              data-tone={i % 2 === 0 ? 'green' : 'gold'}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, delay: 0.1 * (i % 2) },
              }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              viewport={{ once: true, amount: 0.15 }}
            >
              <span className={badge}>{String(i + 1).padStart(2, '0')}</span>
              <p className={text}>{point}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
    </MotionConfig>
  );
};

export default PeopleCulture;
