'use client';

import React from 'react';
import Image from 'next/image';

import layoutTL from '@/assets/layout/grid-top-leaf.svg';

import style from './aboutUs.module.scss';

const { aboutUs, heading, layoutLeft, img, description } = style;

interface IAboutUsProps {
  data: {
    heading: string;
    description: string;
  };
}

const AboutUs = ({ data }: IAboutUsProps) => {
  const headingString = data?.heading;
  const separator = '/'; // The separator between the two parts of the string

  const partsArray = headingString?.split(separator);
  const headingFirstPart = partsArray?.shift();
  const headingSecondPart = partsArray?.pop();

  return (
    <div className={aboutUs}>
      <div className={layoutLeft}>
        <Image className={img} src={layoutTL} alt="layout" />
      </div>
      <h2 className={heading}>
        <span>{headingFirstPart}</span>
        <span>{headingSecondPart}</span>
      </h2>
      <div
        className={description}
        dangerouslySetInnerHTML={{ __html: data?.description }}
      ></div>
    </div>
  );
};

export default AboutUs;
