'use client';

import React from 'react';
import Image from 'next/image';

import style from './heroSection.module.scss';
import { IHeroSectionData } from './HeroSection.types';

const { heroSection, imageContainer, img, content, heading } = style;

interface IHeroSectionProps {
  data: IHeroSectionData;
}

const HeroSection = ({ data }: IHeroSectionProps) => {
  return (
    <div className={heroSection}>
      <div className={imageContainer}>
        <Image
          className={img}
          src={data.image}
          alt="bg img"
          width={1000}
          height={1000}
          priority
        />
      </div>
      <div className={content}>
        <h1 className={heading}>{data.title}</h1>
      </div>
    </div>
  );
};

export default HeroSection;
