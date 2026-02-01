'use client';

import React from 'react';
import Image from 'next/image';

import { IMAGE_BASE_URL } from '@/config';

import style from './heroSection.module.scss';
import { IHeroSectionData } from './HeroSection.types';

const {
  storyDetail,
  bgImageContainer,
  bgImage,
  heading,
  textLarge,
  textSmall,
} = style;

interface IHeroSectionProps {
  data: IHeroSectionData;
}

const HeroSection = ({ data }: IHeroSectionProps) => {
  return (
    <div className={storyDetail}>
      <div className={bgImageContainer}>
        <Image
          className={bgImage}
          src={IMAGE_BASE_URL + data.image}
          alt="bg img"
          width={2000}
          height={2000}
        />
      </div>
      <h1 className={heading}>
        <span className={textLarge}>{data.title}</span>
        <span className={textSmall}>{data.subtitle}</span>
      </h1>
    </div>
  );
};

export default HeroSection;
