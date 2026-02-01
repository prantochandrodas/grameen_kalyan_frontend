import React from 'react';
import Link from 'next/link';

import AlbumItem from './AlbumItem/AlbumItem';
import { IAlbumsProps } from './Album.types';

import style from './album.module.scss';
const { albumContainer, albumGrid, link } = style;

const Album = ({ albumsData }: IAlbumsProps) => {
  return (
    <div className={albumContainer}>
      <div className={albumGrid}>
        {albumsData?.map((albumData) => (
          <Link
            className={link}
            key={albumData.id}
            href={`/photo-gallery/${albumData.id}`}
          >
            <AlbumItem data={albumData} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Album;
