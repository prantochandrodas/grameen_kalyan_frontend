'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

import CulturalPrioritiesCard from '../CulturalPrioritiesCard/CulturalPrioritiesCard';
import culturalPrioritiesData from '@/assets/data/culturalPrioritiesData';

import style from './culturalPriorities.module.scss';

const {
  culturalPriorities,
  show,
  intro,
  eyebrow,
  heading,
  highlight,
  subText,
  cards,
} = style;

const CulturalPriorities = () => {
  const [inView, setInView] = useState(false);

  return (
    <motion.div
      className={inView ? `${culturalPriorities} ${show}` : culturalPriorities}
      onViewportEnter={() => setInView(true)}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className={intro}>
        <h2 className={heading}>
          Grameen Kalyan goes out of its way to harmonize cultural priorities & values to the employees and health force
          {/* <span className={highlight}>
            {' '}
          </span> */}
        </h2>
        <p className={subText}>
          We are committed to serving people and communities by providing
          quality healthcare, education and support services, while upholding
          the highest standards of integrity, compassion and social
          responsibility.
        </p>
      </div>
      <div className={cards}>
        {culturalPrioritiesData.map((data) => {
          if (Number(data.number) % 2 === 0) {
            return (
              <CulturalPrioritiesCard key={data.number} data={data} reverse />
            );
          }
          return <CulturalPrioritiesCard key={data.number} data={data} />;
        })}
      </div>
    </motion.div>
  );
};

export default CulturalPriorities;
