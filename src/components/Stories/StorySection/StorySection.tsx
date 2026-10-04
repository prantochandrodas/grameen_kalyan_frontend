import React from 'react';
import Image from 'next/image';
import { FaLeaf } from 'react-icons/fa';

import CategoryShowcase from '@/shared/components/CategoryShowcase/CategoryShowcase';
import { ICategory } from '@/shared/types/category';
import layoutLT from '@/assets/layout/stories/GK_website_OPT_01_People_HealthForce-02.svg';
import layoutRB from '@/assets/layout/stories/GK_website_OPT_01-02.svg';

import style from './storySection.module.scss';
const {
  page,
  storySection,
  eyebrow,
  eyebrowLine,
  heading,
  highlight,
  parag,
  divider,
  dividerLine,
  dividerIcon,
  storyDisplay,
  img,
  layoutLeftTop,
  layoutRightBottom,
} = style;

interface IStorySectionProps {
  stroyCategories: ICategory[];
}

const StorySection = ({ stroyCategories }: IStorySectionProps) => {
  // Links need a dataType; default to "story" when the API data has none.
  const showcaseData = stroyCategories?.map((category) => ({
    ...category,
    dataType: (category as { dataType?: string }).dataType ?? 'story',
  }));

  return (
    <div className={page}>
      <div className={layoutLeftTop}>
        <Image
          src={layoutLT}
          className={img}
          alt=""
          width={100}
          height={100}
        />
      </div>
      <div className={layoutRightBottom}>
        <Image
          src={layoutRB}
          className={img}
          alt=""
          width={100}
          height={100}
        />
      </div>

      <div className={storySection}>
        <p className={eyebrow}>
          <span className={eyebrowLine} />
          Since 1996
          <span className={eyebrowLine} />
        </p>

        <h2 className={heading}>
          <span>Effort Behind</span>
          <span>
            Thousands of <span className={highlight}>Real Stories</span>
          </span>
        </h2>

        <p className={parag}>
          Since 1996, Grameen Kalyan has delivered affordable and quality
          primary healthcare to rural communities and economically vulnerable
          people, creating a healthier and brighter future. Our effort has
          reached millions of people across the country and become a part of
          their journey of well-being.
        </p>

        <div className={divider} aria-hidden="true">
          <span className={dividerLine} />
          <FaLeaf className={dividerIcon} />
          <span className={dividerLine} />
        </div>
      </div>

      <div className={storyDisplay}>
        <CategoryShowcase data={showcaseData} />
      </div>
    </div>
  );
};

export default StorySection;
