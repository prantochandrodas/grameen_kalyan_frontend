'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaChevronRight, FaHandHoldingHeart } from 'react-icons/fa';

import { IMAGE_BASE_URL } from '@/config';

import style from './heroSection.module.scss';
import { IHeroSectionData } from './HeroSection.types';

const {
  hero,
  breadcrumbWrap,
  breadcrumb,
  banner,
  bannerOverlay,
  headerWrap,
  badge,
  title,
  subTitle,
} = style;

interface IHeroSectionProps {
  data: IHeroSectionData;
}

const toUrl = (src: string) => {
  if (src.startsWith('http')) return src;
  const path = src.startsWith('/') ? src : `/${src}`;
  return `${IMAGE_BASE_URL}${path}`;
};

const HeroSection = ({ data }: IHeroSectionProps) => {
  const image = data?.image?.trim();

  return (
    <section className={hero}>
      {/* ---- Breadcrumb ---- */}
      <div className={breadcrumbWrap}>
        <div className={breadcrumb}>
          <Link href="/">Home</Link>
          <FaChevronRight />
          <Link href="/healthcare">Healthcare</Link>
          <FaChevronRight />
          <span>{data?.title}</span>
        </div>
      </div>

      {/* ---- Banner image ---- */}
      {image ? (
        <div className={banner}>
          <Image
            src={toUrl(image)}
            alt={data?.title || 'banner'}
            fill
            sizes="100vw"
            priority
          />
          <div className={bannerOverlay} />
        </div>
      ) : null}

      {/* ---- Title area ---- */}
      <div className={headerWrap}>
        <span className={badge}>
          <FaHandHoldingHeart /> HEALTHCARE
        </span>
        <h1 className={title}>{data?.title}</h1>
        {data?.SubTitle ? <h2 className={subTitle}>{data.SubTitle}</h2> : null}
      </div>
    </section>
  );
};

export default HeroSection;