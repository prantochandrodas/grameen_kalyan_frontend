'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

import layoutTopLeft from '@/assets/layout/layout-tl-healthcare.svg';
import layoutBottomRight from '@/assets/layout/grid-bottom-leaf.svg';
import { IHealthcareService } from '@/shared/types/healthcareService';
import { IMAGE_BASE_URL } from '@/config';

import style from './healthcareService.module.scss';
import Link from 'next/link';

const {
  healthcareService,
  layoutTL,
  layoutBR,
  gridContainer,
  healthcareServiceCard,
  imageContainer,
  img,
  heading,
  verticalLine,
  horizontalLine,
  box,
} = style;

interface IHealthcareServiceProps {
  servicesData: IHealthcareService[];
}

const HealthcareService = ({ servicesData }: IHealthcareServiceProps) => {
  return (
    <div className={healthcareService}>
      <div className={layoutTL}>
        <Image className={img} src={layoutTopLeft} alt="layout" />
      </div>
      <div className={layoutBR}>
        <Image className={img} src={layoutBottomRight} alt="layout" />
      </div>
      <div className={gridContainer}>
        {servicesData?.map((data, index) => {
          return (
            <>
              <motion.div
                style={{ position: 'relative' }}
                initial={{ opacity: 0, bottom: '-5rem' }}
                whileInView={{ opacity: 1, bottom: '0' }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                key={data.id}
                className={healthcareServiceCard}
              >
                <Link href={`/healthcare/${data.id}`}>
                  <div className={imageContainer}>
                    <Image
                      className={img}
                      src={IMAGE_BASE_URL + data.thumb_image}
                      alt="healthcare"
                      width={500}
                      height={500}
                    />
                  </div>
                </Link>
                <h3 className={heading}>{data.title}</h3>
              </motion.div>
              {index % 2 === 0 && <div className={verticalLine} />}
              {index === 1 && (
                <>
                  <div className={horizontalLine} />
                  <div className={box} />
                  <div className={horizontalLine} />
                </>
              )}
              {index === 3 && (
                <>
                  <div className={horizontalLine} />
                  <div className={box} />
                  <div className={horizontalLine} />
                </>
              )}
              {index === 5 && (
                <>
                  <div className={horizontalLine} />
                  <div className={box} />
                  <div className={horizontalLine} />
                </>
              )}
            </>
          );
        })}
      </div>
    </div>
  );
};

export default HealthcareService;
