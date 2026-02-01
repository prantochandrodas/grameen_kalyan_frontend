'use client';

import React from 'react';
import Image from 'next/image';

import { IMAGE_BASE_URL } from '@/config';

import { IServiceCardProps } from './service.type';
import style from './serviceCard.module.scss';

const { serviceCard, mask, heading, imgContainer, img } = style;

const ServiceCard = ({ service }: IServiceCardProps) => {
  return (
    <div className={serviceCard}>
      <div className={mask}>
        <h4 className={heading}>{service.title}</h4>
      </div>
      <div className={imgContainer}>
        <Image
          className={img}
          src={IMAGE_BASE_URL + service.homepage_thumb_image}
          alt="service"
          width={1000}
          height={1000}
        />
      </div>
    </div>
  );
};

export default ServiceCard;
