'use client';

import React from 'react';
import Image from 'next/image';

import style from './detailSection.module.scss';
import { Button } from '@/shared/components';
import { IMAGE_BASE_URL } from '@/config';

const { detailSection, contentContainer, btnContainer, imgContainer, img } =
  style;

interface IDetailSectionProps {
  detail: string;
  image: string;
}

const DetailSection = ({ detail, image }: IDetailSectionProps) => {
  return (
    <div className={detailSection}>
      <div
        className={contentContainer}
        dangerouslySetInnerHTML={{ __html: detail }}
      ></div>
      <div className={imgContainer}>
        <Image
          className={img}
          src={IMAGE_BASE_URL + image}
          alt="img"
          width={100}
          height={100}
          loader={() => IMAGE_BASE_URL + image}
        />
      </div>
      <div className={btnContainer}>
        <Button text="Back" url="/healthcare" btnSecondary />
      </div>
    </div>
  );
};

export default DetailSection;
