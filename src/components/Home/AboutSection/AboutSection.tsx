'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

import layoutImage from '@/assets/layout/layout-br.svg';

import style from './aboutSection.module.scss';
import { IAboutdata } from './aboutData.type';

const { aboutSection, content, heading, subHeading, layout, img } = style;

interface IAboutSectionProps {
  data: IAboutdata;
}

const AboutSection = ({ data }: IAboutSectionProps) => {
  return (
    <div className={aboutSection}>
      <div className={content}>
        <motion.h2
          initial={{ opacity: 0, bottom: '-10rem' }}
          whileInView={{ opacity: 1, bottom: '0' }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={heading}
        >
          {data.title}
        </motion.h2>
        <h4 className={subHeading}>
          <motion.span
            initial={{ opacity: 0, bottom: '-10rem' }}
            whileInView={{ opacity: 1, bottom: '0' }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {data.subTitleOne}
          </motion.span>
          <motion.span
            initial={{ opacity: 0, bottom: '-10rem' }}
            whileInView={{ opacity: 1, bottom: '0' }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            {data.subTitleTwo}
          </motion.span>
        </h4>
      </div>
      <div className={layout}>
        <Image className={img} src={layoutImage} alt="layout" />
      </div>
    </div>
  );
};

export default AboutSection;
