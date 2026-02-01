import React from 'react';
import Image from 'next/image';

import bgImage from '@/assets/images/home/annual-section-bg.webp';

import style from './teamGroup.module.scss';
import { ITeamGroup } from './teamGroup.type';

const {
  annualSection,
  heading,
  container,
  bgContainer,
  img,
  annualSectionT,
  headingSingle,
} = style;

const TeamGroup = ({
  headingTextOne,
  headingTextTwo,
  marginTop,
  image,
}: ITeamGroup) => {
  return (
    <div
      className={
        marginTop ? `${annualSection} ${annualSectionT}` : `${annualSection}`
      }
    >
      <h1
        className={
          headingTextOne && headingTextTwo
            ? `${heading}`
            : `${heading} ${headingSingle}`
        }
      >
        <span>{headingTextOne}</span>
        <span>{headingTextTwo}</span>
      </h1>
      {/* <div className={container}>
        <div className={bgContainer}>
          <Image className={img} src={image || bgImage} alt='bg-img' width={3000} height={3000}/>
        </div>
      </div> */}
    </div>
  );
};

export default TeamGroup;
