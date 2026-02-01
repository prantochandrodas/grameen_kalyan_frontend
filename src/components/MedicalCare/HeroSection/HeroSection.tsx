'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import { IMAGE_BASE_URL } from '@/config';

import style from './heroSection.module.scss';
import { IHeroSectionData } from './HeroSection.types';

const { serviceDetail, bgImageContainer, bgImage, heading } = style;

interface IHeroSectionProps {
  data: IHeroSectionData;
}

const HeroSection = ({ data }: IHeroSectionProps) => {
  const [isSame, setIsSame] = useState(false);

  const handleCheck = () => {
    if (data.SubTitle === '/') {
      setIsSame(true);
    }
  };

  useEffect(() => {
    handleCheck();
  }, [isSame]);

  return (
    <div className={serviceDetail}>
      <div className={bgImageContainer}>
        <Image
          className={bgImage}
          src={IMAGE_BASE_URL + data.image}
          alt="bg img"
          height={1000}
          width={1000}
        />
      </div>
      <h1 className={heading}>
        <span>{data.title}</span>
        {!isSame ? <span>{data.SubTitle}</span> : null}
      </h1>
    </div>
  );
};

export default HeroSection;
