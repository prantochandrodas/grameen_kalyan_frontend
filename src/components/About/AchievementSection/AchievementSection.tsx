'use client';

import React from 'react';

import { IMAGE_BASE_URL } from '@/config';

import style from './achievementSection.module.scss';
import Image from 'next/image';
import { IAchievementSection } from './AchievementSection.types';

const {
  achievementSection,
  img,
  verticalTopLine,
  verticalBottomLine,
  horizontalLeftLine,
  squareBox,
  horizontalRightLine,
  heading,
  imageContainer,
  contentContainer,
  contentContainerReverse,
  imageContainerReverse,
} = style;

const AchievementSection = ({ achievementData }: IAchievementSection) => {
  const firstAchievement = achievementData.filter(
    (achievement) => achievement.id === 1
  );
  const achievements = achievementData.filter(
    (achievement) => achievement.id !== 1
  );

  return (
    <div className={achievementSection}>
      {firstAchievement?.map((data) => {
        const imageUrl = IMAGE_BASE_URL + data.thumb_image;
        return (
          <>
            <div className={imageContainer}>
              <Image
                className={img}
                src={imageUrl}
                alt={data.title}
                width={500}
                height={500}
                priority
              />
            </div>
            <div className={verticalTopLine} />
            <div className={contentContainer}>
              <h3 className={heading}>{data.title}</h3>
              <div dangerouslySetInnerHTML={{ __html: data.details }}></div>
            </div>
          </>
        );
      })}
      {achievements?.map((data) => {
        const imageUrl = IMAGE_BASE_URL + data.thumb_image;

        if (data.id % 2 === 0) {
          return (
            <>
              <div className={horizontalLeftLine} />
              <div className={squareBox} />
              <div className={horizontalRightLine} />
              <div className={`${contentContainer} ${contentContainerReverse}`}>
                <h3 className={heading}>{data.title}</h3>
                <div dangerouslySetInnerHTML={{ __html: data.details }}></div>
              </div>
              <div className={verticalBottomLine} />
              <div className={`${imageContainer} ${imageContainerReverse}`}>
                <Image
                  className={img}
                  src={imageUrl}
                  alt={data.title}
                  width={500}
                  height={500}
                  priority
                />
              </div>
            </>
          );
        }
        return (
          <>
            <div className={horizontalLeftLine} />
            <div className={squareBox} />
            <div className={horizontalRightLine} />
            <div className={imageContainer}>
              <Image
                className={img}
                src={imageUrl}
                alt={data.title}
                width={500}
                height={500}
                priority
              />
            </div>
            <div className={verticalBottomLine} />
            <div className={contentContainer}>
              <h3 className={heading}>{data.title}</h3>
              <div dangerouslySetInnerHTML={{ __html: data.details }}></div>
            </div>
          </>
        );
      })}
    </div>
  );
};

export default AchievementSection;
