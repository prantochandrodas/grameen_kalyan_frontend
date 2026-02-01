import React from 'react';
import Image from 'next/image';

import layoutLT from '@/assets/layout/grid-top-leaf.svg';
import layoutRB from '@/assets/layout/grid-bottom-leaf.svg';

import style from './aboutSection.module.scss';

const { aboutSection, text, layoutLeft, layoutRight, img } = style;

const AboutSection = () => {
  return (
    <div className={aboutSection}>
      <div className={layoutLeft}>
        <Image className={img} src={layoutLT} alt="layout" />
      </div>
      <div className={layoutRight}>
        <Image className={img} src={layoutRB} alt="layout" />
      </div>
      <p className={text}>
        Making a cost-effective, equitable, self-sustainable and extended rural
        health program for the low-income population by implementing the concept
        of community-based health centres, bringing the affordable Primary
        Healthcare to the doorsteps of the villagers and mobilizing
        beneficiaries through Micro Health Insurance scheme.
      </p>
    </div>
  );
};

export default AboutSection;
