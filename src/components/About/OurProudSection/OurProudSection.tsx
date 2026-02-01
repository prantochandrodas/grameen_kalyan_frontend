'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const bgImage =
  'https://res.cloudinary.com/dboyf6lad/image/upload/v1692613875/proud-bg_bu0agc.jpg';

import style from './ourProudSection.module.scss';
import { IOurProudSection } from './ourProudSection.type';

const {
  annualSection,
  heading,
  container,
  bgContainer,
  img,
  contentContainer,
  content,
  gridContainer,
  text,
  number,
  title,
  subHeading,
} = style;

const OurProudSection = ({
  proudPresenceData,
  headingText,
  subHeadingText,
}: IOurProudSection) => {
  return (
    <div className={annualSection}>
      <h1 className={heading}>
        <span>{headingText}</span>
        <span className={subHeading}>{subHeadingText}</span>
      </h1>
      <div className={container}>
        <div className={bgContainer}>
          <Image
            className={img}
            src={bgImage}
            alt="bg-img"
            width={1000}
            height={1000}
          />
        </div>
        <div className={contentContainer}>
          <div className={gridContainer}>
            {proudPresenceData.map((data) => (
              <div key={data.id} className={content}>
                <motion.p
                  style={{ position: 'relative' }}
                  initial={{ opacity: 0, bottom: '-5rem' }}
                  whileInView={{ opacity: 1, bottom: '0' }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className={text}
                >
                  <span className={number}>{data.value}</span>
                  <span className={title}>{data.title}</span>
                </motion.p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurProudSection;
