'use client';

import React from 'react';
import Image from 'next/image';

import layoutTL from '@/assets/layout/grid-top-leaf.svg';

import style from './empoweringSection.module.scss';
import { IEmpoweringSectionProps } from './EmpoweringSection.types';

const { empoweringSection, heading, layoutLeft, img, paragraphsContainer } =
  style;

const EmpoweringSection = ({ empoweringData }: IEmpoweringSectionProps) => {
  return (
    <div className={empoweringSection}>
      <div className={layoutLeft}>
        <Image className={img} src={layoutTL} alt="layout" />
      </div>
      <h2 className={heading}>{empoweringData.title}</h2>
      <div
        className={paragraphsContainer}
        dangerouslySetInnerHTML={{ __html: empoweringData.details }}
      ></div>
    </div>
  );
};

export default EmpoweringSection;
