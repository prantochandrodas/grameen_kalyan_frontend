'use client';

import React from 'react';
import Image from 'next/image';

import { IMAGE_BASE_URL } from '@/config';

import { PhotoView } from 'react-photo-view';
import { IGalleryData } from '../Gallery.types';

import style from './photoCard.module.scss';
const { photoCard, imgContainer, img, imgBg, zoomBadge } = style;

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
      <div
        className={photoCard}
        role="button"
        tabIndex={0}
        aria-label={data.title ? `View photo: ${data.title}` : 'View photo'}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.currentTarget.click();
          }
        }}
      >
        <div className={imgContainer}>
          {/* Blurred backdrop layer */}
          <Image
            className={imgBg}
            src={IMAGE_BASE_URL + data.thumb_image}
            alt=""
            fill
            sizes="(max-width: 380px) 100vw, (max-width: 900px) 50vw, (max-width: 1400px) 33vw, 25vw"
            aria-hidden="true"
          />
          {/* Expand badge */}
          <span className={zoomBadge} aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 3 21 3 21 9" />
              <polyline points="9 21 3 21 3 15" />
              <line x1="21" y1="3" x2="14" y2="10" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
          </span>

          {/* Full photo, uncropped */}
          <Image
            className={img}
            src={IMAGE_BASE_URL + data.thumb_image}
            alt={data.title || 'gallery image'}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 962px) 50vw, 33vw"
          />
        </div>
      </div>
    </PhotoView>
  );
};

export default PhotoCard;