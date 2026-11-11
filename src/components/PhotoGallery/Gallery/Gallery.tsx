'use client';

import React from 'react';
import Link from 'next/link';
import { PhotoProvider } from 'react-photo-view';

import PhotoCard from './PhotoCard/PhotoCard';

import style from './gallery.module.scss';
import 'react-photo-view/dist/react-photo-view.css';
import { IGalleryData } from './Gallery.types';

const {
  galleryContainer,
  header,
  eyebrow,
  heading,
  headingBar,
  count,
  galleryGrid,
  backButton,
  empty,
} = style;

interface IGalleryProps {
  data: IGalleryData[];
  backHref?: string;
  backLabel?: string;
}

const Gallery = ({
  data,
  backHref = '/photo-gallery',
  backLabel = 'Back to Albums',
}: IGalleryProps) => {
  const photos = Array.isArray(data) ? data : [];
  const albumTitle = photos[0]?.album_title;

  return (
    <PhotoProvider maskOpacity={0.9}>
      <section className={galleryContainer}>
        <div className={header}>
          <span className={eyebrow}>Photo Gallery</span>
          {albumTitle && <h2 className={heading}>{albumTitle}</h2>}
          <span className={headingBar} />
          {/* {photos.length > 0 && (
            <p className={count}>
              {photos.length} {photos.length === 1 ? 'Photo' : 'Photos'}
            </p>
          )} */}
        </div>

        {photos.length > 0 ? (
          <div className={galleryGrid}>
            {photos.map((item) => (
              <PhotoCard key={item.id} data={item} />
            ))}
          </div>
        ) : (
          <p className={empty}>No photos available in this album yet.</p>
        )}

        <div className={backButton}>
          <Link href={backHref}>&larr; {backLabel}</Link>
        </div>
      </section>
    </PhotoProvider>
  );
};

export default Gallery;