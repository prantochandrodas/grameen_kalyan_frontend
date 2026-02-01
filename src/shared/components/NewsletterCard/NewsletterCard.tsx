'use client';

import React from 'react';
import Image from 'next/image';

import { INewsletter } from '@/shared/types/newsletter';
const dummyImg =
  'https://res.cloudinary.com/dboyf6lad/image/upload/v1693472682/MicrosoftTeams-image_80_wmqvsd.png';

import style from './newsletterCard.module.scss';

const {
  newsletterCard,
  container,
  imgContainer,
  contentContainer,
  title,
  img,
  mask,
} = style;

interface INewsletterCardProps {
  data: INewsletter;
}

const NewsletterCard = ({ data }: INewsletterCardProps) => {
  return (
    <div className={newsletterCard}>
      <div className={container}>
        <div className={imgContainer}>
          <Image
            className={img}
            src={dummyImg}
            alt="card img"
            width={1000}
            height={1000}
          />
        </div>
        <div className={mask}>
          <h2>Newsletter</h2>
        </div>
      </div>
      <div className={contentContainer}>
        <h3 className={title}>{data.title}</h3>
      </div>
    </div>
  );
};

export default NewsletterCard;
