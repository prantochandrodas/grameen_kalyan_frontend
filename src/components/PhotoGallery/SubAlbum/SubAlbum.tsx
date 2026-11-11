'use client';

import React from 'react';
import Link from 'next/link';

import AlbumItem from '../Album/AlbumItem/AlbumItem';

import style from '../Gallery/gallery.module.scss';
const {
  galleryContainer,
  header,
  eyebrow,
  heading,
  headingBar,
  subAlbumGrid,
  subLink,
  backButton,
} = style;

interface ISubAlbumItem {
  id: number | string;
  title: string;
  sub_album_photo: string;
}

interface ISubAlbumProps {
  albumId: number;
  albumTitle: string;
  subAlbums: ISubAlbumItem[];
}

const SubAlbum = ({ albumId, albumTitle, subAlbums }: ISubAlbumProps) => {
  return (
    <section className={galleryContainer}>
      <div className={header}>
        <span className={eyebrow}>Photo Albums</span>
        <h2 className={heading}>{albumTitle}</h2>
        <span className={headingBar} />
      </div>

      <div className={subAlbumGrid}>
        {subAlbums.map((subAlbum) => (
          <Link
            key={subAlbum.id}
            className={subLink}
            href={`/photo-gallery/${albumId}/${subAlbum.id}`}
          >
            <AlbumItem
              data={{
                title: subAlbum.title,
                album_photo: subAlbum.sub_album_photo,
              }}
            />
          </Link>
        ))}
      </div>

      <div className={backButton}>
        <Link href="/photo-gallery">&larr; Back to Albums</Link>
      </div>
    </section>
  );
};

export default SubAlbum;