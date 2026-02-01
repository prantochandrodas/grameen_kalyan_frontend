'use client';

import React from 'react';
import Image from 'next/image';

import { IMAGE_BASE_URL } from '@/config';

import style from './heroSection.module.scss';
import { IHeroSectionData } from './HeroSection.types';

const { serviceDetail, bgImageContainer, bgImage } = style;

interface IHeroSectionProps {
  data: IHeroSectionData;
}

const HeroSection = ({ data }: IHeroSectionProps) => {
  return (
    <div className={serviceDetail}>
      <div className={bgImageContainer}>
        <Image
          className={bgImage}
          src={IMAGE_BASE_URL + (data && data.heroImage)}
          alt="bg img"
          height={100}
          width={100}
          loader={() => IMAGE_BASE_URL + (data && data.heroImage)}
        />
      </div>
      <h1>
        <span>{data?.heroTitle}</span>
      </h1>
    </div>
  );
};

export default HeroSection;
