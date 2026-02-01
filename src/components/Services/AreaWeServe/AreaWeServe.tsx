'use client';

import React from 'react';
import { motion } from 'framer-motion';

import areaIconOne from '@/assets/icons/area-icon-1.svg';
import areaIconTwo from '@/assets/icons/area-icon-2.svg';
import areaIconThree from '@/assets/icons/area-icon-3.svg';
import areaIconFour from '@/assets/icons/area-icon-4.svg';

import style from './areaWeServe.module.scss';
import Image from 'next/image';
import Link from 'next/link';

const {
  areaWeServeSection,
  contentContainer,
  subHeading,
  heading,
  areaWeServeContainer,
  iconContainer,
  areaHealthcare,
  areaWellBeing,
  areaEmergencyResponse,
  areaSocialBusiness,
  layout,
  img,
} = style;

const AreaWeServe = () => {
  return (
    <div className={areaWeServeSection}>
      <div className={contentContainer}>
        <motion.h4
          style={{ position: 'relative' }}
          initial={{ opacity: 0, bottom: '-5rem' }}
          whileInView={{ opacity: 1, bottom: '0' }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={subHeading}
        >
          <span>Enabling and empowering people</span>
          <span>to elevate themselves out of poverty</span>
        </motion.h4>
        <motion.h2
          style={{ position: 'relative' }}
          initial={{ opacity: 0, bottom: '-5rem' }}
          whileInView={{ opacity: 1, bottom: '0' }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={heading}
        >
          Areas We Serve
        </motion.h2>
      </div>

      <div className={areaWeServeContainer}>
        <div className={layout} />
        <Link href="/services#healthcare">
          <div className={areaHealthcare}>
            <h3 className={heading}>Healthcare</h3>
            <div className={iconContainer}>
              <Image className={img} src={areaIconOne} alt="icon" />
            </div>
          </div>
        </Link>
        <Link href="/services#well-being">
          <div className={areaWellBeing}>
            <h3 className={heading}>Well-Being</h3>
            <div className={iconContainer}>
              <Image className={img} src={areaIconTwo} alt="icon" />
            </div>
          </div>
        </Link>
        <Link href="/services#emergency-response">
          <div className={areaEmergencyResponse}>
            <h3 className={heading}>
              <span>Emergency</span>
              <span>Response</span>
            </h3>
            <div className={iconContainer}>
              <Image className={img} src={areaIconThree} alt="icon" />
            </div>
          </div>
        </Link>
        <Link href="/services#social-business">
          <div className={areaSocialBusiness}>
            <h3 className={heading}>
              <span>Social</span>
              <span>Business</span>
            </h3>
            <div className={iconContainer}>
              <Image className={img} src={areaIconFour} alt="icon" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AreaWeServe;
