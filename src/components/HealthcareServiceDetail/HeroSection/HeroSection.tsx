'use client';

import React from 'react';
import Image from 'next/image';

import { IMAGE_BASE_URL } from '@/config';

import style from './heroSection.module.scss';
import { IHeroSectionData } from './HeroSection.types';

const { serviceDetail, bgImageContainer, bgImage, heading } = style;

interface IHeroSectionProps {
  data: IHeroSectionData;
}

const HeroSection = ({ data }: IHeroSectionProps) => {
  return (
    <div className={serviceDetail}>
      <div className={bgImageContainer}>
        <Image
          className={bgImage}
          src={IMAGE_BASE_URL + (data && data.image)}
          alt="bg img"
          height={2000}
          width={2000}
        />
      </div>
      <h1 className={heading}>
        <span>{data?.title}</span>
        <span>{data?.SubTitle}</span>
      </h1>
    </div>
  );
};

export default HeroSection;
