'use client';

import React from 'react';
import Image from 'next/image';

import { IStories } from '@/shared/types/stories';
import { IMAGE_BASE_URL } from '@/config';

import style from './listCard.module.scss';

const { listCard, container, imgContainer, contentContainer, title, img } =
  style;

interface IListCardProps {
  data: IStories;
}

const ListCard = ({ data }: IListCardProps) => {
  return (
    <div className={listCard}>
      <div className={container}>
        <div className={imgContainer}>
          <Image
            className={img}
            src={IMAGE_BASE_URL + data.thumb_image}
            alt="card img"
            width={100}
            height={100}
            loader={() => IMAGE_BASE_URL + data.thumb_image}
          />
        </div>
      </div>
      <div className={contentContainer}>
        <h3 className={title}>{data.title}</h3>
      </div>
    </div>
  );
};

export default ListCard;
