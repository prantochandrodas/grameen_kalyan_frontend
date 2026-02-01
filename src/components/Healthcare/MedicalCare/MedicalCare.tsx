'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

import layoutL from '@/assets/layout/healthcare/GK_website_OPT_01_Healthcare-04.svg';
import layoutR from '@/assets/layout/healthcare/GK_website_OPT_01_Locator-04.svg';

import style from './medicalCare.module.scss';

const {
  medicalCare,
  contentContainer,
  heading,
  parag,
  layoutLeft,
  layoutRight,
  img,
} = style;

const MedicalCare = () => {
  return (
    <div className={medicalCare}>
      <div className={contentContainer}>
        <div className={layoutLeft}>
          <Image className={img} src={layoutL} alt="layout" />
        </div>
        <div className={layoutRight}>
          <Image className={img} src={layoutR} alt="layout" />
        </div>
        <h2 className={heading}>
          <motion.span
            style={{ position: 'relative' }}
            initial={{ opacity: 0, bottom: '-5rem' }}
            whileInView={{ opacity: 1, bottom: '0' }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Disease Specific
          </motion.span>
          <motion.span
            style={{ position: 'relative' }}
            initial={{ opacity: 0, bottom: '-5rem' }}
            whileInView={{ opacity: 1, bottom: '0' }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Medical Care
          </motion.span>
        </h2>
        <motion.p
          style={{ position: 'relative' }}
          initial={{ opacity: 0, bottom: '-5rem' }}
          whileInView={{ opacity: 1, bottom: '0' }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={parag}
        >
          To ensure comprehensive primary healthcare, our disease specific
          medical care lays on these areas, for patients to choose from
        </motion.p>
      </div>
    </div>
  );
};

export default MedicalCare;
