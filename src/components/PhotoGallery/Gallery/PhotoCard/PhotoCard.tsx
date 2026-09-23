'use client';

import React from 'react';
import Image from 'next/image';

import { IMAGE_BASE_URL } from '@/config';

import { PhotoView } from 'react-photo-view';
import { IGalleryData } from '../Gallery.types';

import style from './photoCard.module.scss';
const { photoCard, imgContainer, img, imgBg, title } = style;

interface IPhotoCardProps {
  data: IGalleryData;
}

const PhotoCard = ({ data }: IPhotoCardProps) => {
  const fullImage =
    (data as any).image ??
    (data as any).photo ??
    (data as any).full_image ??
    (data as any).original_image ??
    data.thumb_image;

  return (
    <PhotoView src={IMAGE_BASE_URL + fullImage}>
      <div className={photoCard}>
        <div className={imgContainer}>
          {/* Blur করা background layer */}
          <Image
            className={imgBg}
            src={IMAGE_BASE_URL + data.thumb_image}
            alt=""
            fill
            aria-hidden="true"
          />
          {/* আসল ছবি — সম্পূর্ণ, uncropped */}
          <Image
            className={img}
            src={IMAGE_BASE_URL + data.thumb_image}
            alt={data.title || 'gallery image'}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className={title}>
          <h4>{data.title}</h4>
        </div>
      </div>
    </PhotoView>
  );
};

export default PhotoCard;