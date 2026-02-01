/* eslint-disable object-curly-newline */
/* eslint-disable camelcase */

'use client';

import React from 'react';
import Image from 'next/image';

import style from './albumItem.module.scss';
import { IMAGE_BASE_URL } from '@/config';
import { IPhotoAlbums } from '@/shared/types/photoAlbums';

const { albumItem, textContainer, imgContainer, img, title } = style;

interface IAlbumItemProps {
  data: IPhotoAlbums;
}

const AlbumItem = ({ data }: IAlbumItemProps) => {
  return (
    <div className={albumItem}>
      <div className={imgContainer}>
        <Image
          className={img}
          src={IMAGE_BASE_URL + data.album_photo}
          alt="album"
          width={1000}
          height={1000}
          priority
        />
      </div>
      <div className={textContainer}>
        <h4 className={title}>{data.title}</h4>
      </div>
    </div>
  );
};

export default AlbumItem;
