'use client';

import React from 'react';
import Image from 'next/image';

import { IMAGE_BASE_URL } from '@/config';

import { PhotoView } from 'react-photo-view';
import { IGalleryData } from '../Gallery.types';

import style from './photoCard.module.scss';
const { photoCard, mask, imgContainer, img } = style;

interface IPhotoCardProps {
  data: IGalleryData;
}

const PhotoCard = ({ data }: IPhotoCardProps) => {
  return (
    <PhotoView src={IMAGE_BASE_URL + data.thumb_image}>
      <div className={photoCard}>
        <div className={imgContainer}>
          <Image
            className={img}
            src={IMAGE_BASE_URL + data.thumb_image}
            alt=""
            width={500}
            height={500}
          />
        </div>
        <div className={mask}>
          <h4>{data.title}</h4>
        </div>
      </div>
    </PhotoView>
  );
};

export default PhotoCard;
