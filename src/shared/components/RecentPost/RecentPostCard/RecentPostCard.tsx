'use client';

import React from 'react';
import Image from 'next/image';

import { IStories } from '@/shared/types/stories';
import { IMAGE_BASE_URL } from '@/config';

import style from './recentPostCard.module.scss';

const {
  recentPostCard,
  container,
  imgContainer,
  contentContainer,
  title,
  img,
} = style;

interface IRecentPostCardProps {
  data: IStories;
}

const RecentPostCard = ({ data }: IRecentPostCardProps) => {
  return (
    <div className={recentPostCard}>
      <div className={container}>
        <div className={imgContainer}>
          <Image
            className={img}
            src={IMAGE_BASE_URL + data.thumb_image}
            alt="card img"
            width={2000}
            height={2000}
          />
        </div>
      </div>
      <div className={contentContainer}>
        <h3 className={title}>{data.title}</h3>
      </div>
    </div>
  );
};

export default RecentPostCard;
