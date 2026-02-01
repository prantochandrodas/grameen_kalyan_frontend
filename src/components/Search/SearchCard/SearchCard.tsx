'use client';

import React from 'react';
import Image from 'next/image';

import { ISearchResult } from '@/shared/types/searchResult';
import { IMAGE_BASE_URL } from '@/config';

import style from './searchCard.module.scss';

const { searchCard, imageContainer, img, content } = style;

interface ISearchCardProps {
  data: ISearchResult;
}

const SearchCard = ({ data }: ISearchCardProps) => {
  return (
    <div className={searchCard}>
      <div className={imageContainer}>
        <Image
          className={img}
          src={IMAGE_BASE_URL + data.banner_image}
          alt=""
          width={1000}
          height={1000}
          loader={() => IMAGE_BASE_URL + data.banner_image}
        />
      </div>
      <div className={content}>
        <p>{data.name}</p>
        <p>
          {data.address}, {data.division}
        </p>
      </div>
    </div>
  );
};

export default SearchCard;
