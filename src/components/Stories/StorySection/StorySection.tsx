import React from 'react';
import Image from 'next/image';

import { ImageDisplay } from '@/shared/components/ImageDisplay';
import { ICategory } from '@/shared/types/category';
import layoutLT from '@/assets/layout/stories/GK_website_OPT_01_People_HealthForce-02.svg';
import layoutRB from '@/assets/layout/stories/GK_website_OPT_01-02.svg';

import style from './storySection.module.scss';
const {
  storySection,
  heading,
  parag,
  storyDisplay,
  img,
  layoutLeftTop,
  layoutRightBottom,
} = style;

interface IStorySectionProps {
  stroyCategories: ICategory[];
}

const StorySection = ({ stroyCategories }: IStorySectionProps) => {
  return (
    <>
      <div className={storySection}>
        <div className={layoutLeftTop}>
          <Image
            src={layoutLT}
            className={img}
            alt="layout"
            width={100}
            height={100}
          />
        </div>
        <div className={layoutRightBottom}>
          <Image
            src={layoutRB}
            className={img}
            alt="layout"
            width={100}
            height={100}
          />
        </div>
        <h2 className={heading}>
          <span>Effort Behind</span>
          <span>Thousand Real Stories</span>
        </h2>
        <p className={parag}>
          Since 1996, Grameen Kalyan has delivered affordable and quality
          primary healthcare to minimize health inequalities and economic
          setbacks. Our effort touched millions of people across the country and
          became a part of their journey of well-being.
        </p>
      </div>
      <div className={storyDisplay}>
        <ImageDisplay data={stroyCategories} />
      </div>
    </>
  );
};

export default StorySection;
