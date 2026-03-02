/* eslint-disable quotes */
'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

import layoutImage from '@/assets/layout/layout-tr-small.svg';
import titleImage from '@/assets/images/home/title.svg';
import { Sliders } from '@/shared/components';
import { IMAGE_BASE_URL } from '@/config';

import { IHeroSectionProps } from './HeroSection.types';
import './heroSection.scss';

const HeroSection = ({ badgeImage, sliderImages }: IHeroSectionProps) => {
  console.log('Slider Images Array:', sliderImages);

  return (
    <div className="heroSection">
      {/* ========== SLIDER SECTION ========== */}
      <div className="bgImage">
        <Sliders
          infinite={true}
          slideShow={1}
          slideToShowMob={1}
          autoPlay={true}
          autoplaySpeed={3000}
          dots={true}
          customDot="circle"
        >
          {sliderImages?.map((data) => {
            const imageSrc = 'https://admin-grameenkalyan.stitbd.app/' + data.banner_image;

            // Console log for each banner image src
            console.log('Banner Image Src:', imageSrc);

            return (
              <div key={data.id} className="imgContainer">
                <Image
                  className="img"
                  src={imageSrc}
                  alt="Background img"
                  width={2000}
                  height={2000}
                  priority
                />
              </div>
            );
          })}
        </Sliders>
      </div>

      {/* ========== LAYOUT IMAGE ========== */}
      <div className="layout">
        <Image className="img" src={layoutImage} alt="layout" />
      </div>

      {/* ========== BADGE / GLORY IMAGE ========== */}
      <div className="glory">
        <Image
          className="img"
          src={IMAGE_BASE_URL + badgeImage}
          alt="glory"
          width={300}
          height={300}
          priority={true}
        />
      </div>

      {/* ========== TITLE / CONTENT SECTION ========== */}
      <div className="contentContainer">
        <motion.div
          initial={{ opacity: 0, left: '-20rem' }}
          whileInView={{ opacity: 1, left: '0' }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="imgContainer"
        >
          <Image className="img" src={titleImage} alt="title" />
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;