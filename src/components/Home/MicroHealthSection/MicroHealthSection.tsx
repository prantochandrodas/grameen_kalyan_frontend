'use client';

import React from 'react';
import Image from 'next/image';

import { Button } from '@/shared/components';
import { IMAGE_BASE_URL } from '@/config';

import style from './microHealthSection.module.scss';

const {
  microHealthSection,
  heading,
  microHealth,
  container,
  bgContainer,
  insuranceText,
  img,
  contentContainer,
} = style;

interface IMicroHealthSectionProps {
  image: string;
}

const MicroHealthSection = ({ image }: IMicroHealthSectionProps) => {
  return (
    <div className={microHealthSection}>
      <h1 className={heading}>
        <span className={microHealth}> Micro Health</span>
        <span className={insuranceText}>Insurance</span>
      </h1>
      <div className={container}>
        <div className={bgContainer}>
          <Image
            className={img}
            src={IMAGE_BASE_URL + image}
            alt="bg-img"
            width={1000}
            height={1000}
            priority
          />
        </div>
        <div className={contentContainer}>
          <Button text="Read More" url="/healthcare/4" btnSecondary={true} />
        </div>
      </div>
    </div>
  );
};

export default MicroHealthSection;
