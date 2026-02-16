'use client';

import React from 'react';
import { motion } from 'framer-motion';

import { IAnnuallyServe } from '@/shared/types/annuallyServe';

import style from './annuallyServe.module.scss';

const { annuallyServe, firstText, number, secondText } = style;

interface IAnnuallyServeProps {
  data: IAnnuallyServe[];
}

const AnnuallyServe = (data: IAnnuallyServeProps) => {
  const [annuallyServeData] = data.data;

  return (
    <div className={annuallyServe}>
      <h3 className={firstText}>{annuallyServeData.title}</h3>
      <motion.h2
        style={{ position: 'relative' }}
        initial={{ opacity: 0, bottom: '-5rem' }}
        whileInView={{ opacity: 1, bottom: '0' }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className={number}
      >
        {annuallyServeData.value}+
      </motion.h2>
      <motion.h3
        style={{ position: 'relative' }}
        initial={{ opacity: 0, bottom: '-5rem' }}
        whileInView={{ opacity: 1, bottom: '0' }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={secondText}
      >
        People Across the Country
      </motion.h3>
    </div>
  );
};

export default AnnuallyServe;
