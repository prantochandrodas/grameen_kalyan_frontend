'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PhotoProvider } from 'react-photo-view';

import PhotoCard from './PhotoCard/PhotoCard';

import style from './gallery.module.scss';
import 'react-photo-view/dist/react-photo-view.css';
import { IGalleryData } from './Gallery.types';
const { galleryContainer, galleryGrid, backButton } = style;

interface IGalleryProps {
  data: IGalleryData[];
}

const Gallery = ({ data }: IGalleryProps) => {
  const [albumTitle, setAlbumTitle] = useState<string | undefined>();

  const getAlbumTitle = () => {
    const firstData = data?.shift();
    setAlbumTitle(firstData?.album_title);
  };

  useEffect(() => {
    getAlbumTitle();
  }, [albumTitle]);

  return (
    <PhotoProvider>
      <div className={galleryContainer}>
        <h2>{albumTitle}</h2>
        <div className={galleryGrid}>
          {data?.map((item) => (
            <div key={item.id}>
              <PhotoCard data={item} />
            </div>
          ))}
        </div>
        <div className={backButton}>
          <Link href="/photo-gallery">Back</Link>
        </div>
      </div>
    </PhotoProvider>
  );
};

export default Gallery;
