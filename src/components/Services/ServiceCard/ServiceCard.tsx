'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

import { Button } from '@/shared/components';
import { IService } from '@/shared/types/service';
import { IMAGE_BASE_URL } from '@/config';

import style from './serviceCard.module.scss';

const {
  serviceSection,
  heading,
  imgContainer,
  contentContainer,
  img,
  subTitle,
  title,
  parag,
  headingReverse,
  contentContainerReverse,
  imgContainerReverse,
} = style;

interface IServiceSectionProps {
  reverse?: boolean;
  serviceData: IService;
}

const ServiceCard = ({ reverse, serviceData }: IServiceSectionProps) => {
  const slitSubtitleOne = serviceData.sub_title_one.split('/');

  return (
    <div className={serviceSection}>
      <motion.h2
        style={{ position: 'relative' }}
        initial={{ opacity: 0, bottom: '-5rem' }}
        whileInView={{ opacity: 1, bottom: '0' }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={reverse ? `${heading} ${headingReverse}` : `${heading}`}
      >
        {serviceData.title}
      </motion.h2>
      <div
        className={
          reverse ? `${imgContainer} ${imgContainerReverse}` : `${imgContainer}`
        }
      >
        <Image
          className={img}
          src={IMAGE_BASE_URL + serviceData.servicepage_thumb_image}
          alt=""
          height={500}
          width={500}
          priority
        />
      </div>
      <div
        className={
          reverse
            ? `${contentContainer} ${contentContainerReverse}`
            : `${contentContainer}`
        }
      >
        <h4 className={subTitle}>
          {slitSubtitleOne.map((text, index) => (
            <span key={index}>{text}</span>
          ))}
        </h4>
        <h3 className={title}>{serviceData.sub_title_two}</h3>
        <p className={parag}>{serviceData.short_description}</p>
        <Button
          text="Learn More"
          url={
            serviceData.title === 'Healthcare'
              ? '/healthcare'
              : `/services/${serviceData.id}`
          }
          btnSecondary
        />
      </div>
    </div>
  );
};

export default ServiceCard;
