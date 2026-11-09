'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { IStories } from '@/shared/types/stories';
import { IMAGE_BASE_URL } from '@/config';

import style from './recentPostCard.module.scss';

const {
  recentPostCard,
  card,
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
    <Link href={`/stories/${data.id}/${data.id}`} className={recentPostCard}>
      <div className={card}>
        <div className={imgContainer}>
          <Image
            className={img}
            src={IMAGE_BASE_URL + data.thumb_image}
            alt={data.title || 'recent post'}
            width={800}
            height={500}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>

        <div className={contentContainer}>
          <h3 className={title}>{data.title}</h3>
        </div>
      </div>
    </Link>
  );
};

export default RecentPostCard;
