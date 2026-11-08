'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaChevronRight, FaHandHoldingHeart } from 'react-icons/fa';

import { IMAGE_BASE_URL } from '@/config';

import style from './newHeroSection.module.scss';
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

const NewHeroSection = ({ data }: IHeroSectionProps) => {
  const image = data?.image?.trim();

  return (
    <section className={hero}>
      <div className={breadcrumbWrap}>
        <nav className={breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <FaChevronRight />
          <Link href="/stories">Stories</Link>
          <FaChevronRight />
          <span>{data?.title}</span>
        </nav>
      </div>

      {image ? (
        <div className={banner}>
          <Image
            src={toUrl(image)}
            alt={data?.title || 'Story banner'}
            fill
            sizes="100vw"
            priority
          />
          <div className={bannerOverlay} />
        </div>
      ) : null}

      <div className={headerWrap}>
        <span className={badge}>
          <FaHandHoldingHeart /> STORY
        </span>
        <h1 className={title}>{data?.title}</h1>
        {data?.subtitle ? <h2 className={subTitle}>{data.subtitle}</h2> : null}
      </div>
    </section>
  );
};

export default NewHeroSection;