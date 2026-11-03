'use client';

import React from 'react';
import Image from 'next/image';

import { Button } from '@/shared/components';
import { IMAGE_BASE_URL } from '@/config';

import style from './detailSection.module.scss';

const {
  detailSection,
  contentBox,
  cornerAccent,
  contentContainer,
  imageFrame,
  btnContainer,
} = style;

interface IDetailSectionProps {
  detail: string;
  image: string;
}

const toUrl = (src: string) => {
  if (src.startsWith('http')) return src;
  const path = src.startsWith('/') ? src : `/${src}`;
  return `${IMAGE_BASE_URL}${path}`;
};

const DetailSection = ({ detail, image }: IDetailSectionProps) => {
  const imageSrc = image?.trim();

  return (
    <div className={detailSection}>
      {detail ? (
        <div className={contentBox}>
          <span className={cornerAccent} />
          <div
            className={contentContainer}
            dangerouslySetInnerHTML={{ __html: detail }}
          />
        </div>
      ) : null}

      {imageSrc ? (
        <div className={imageFrame}>
          <Image
            src={toUrl(imageSrc)}
            alt="Healthcare service"
            fill
            sizes="(max-width: 768px) 92vw, 80vw"
            unoptimized
          />
        </div>
      ) : null}

      <div className={btnContainer}>
        <Button text="Back" url="/healthcare" btnSecondary />
      </div>
    </div>
  );
};

export default DetailSection;