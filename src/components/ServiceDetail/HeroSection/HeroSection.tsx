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
  imagesGrid,
  imageItem,
  imageBox,
  imageOverlay,
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

/* Accepts array / JSON string / null and returns clean, non-empty paths */
const normalizeImages = (value: unknown): string[] => {
  let list: unknown = value;

  if (typeof list === 'string') {
    try {
      list = JSON.parse(list);
    } catch {
      list = [list];
    }
  }

  if (!Array.isArray(list)) return [];

  return list
    .filter(
      (item): item is string => typeof item === 'string' && item.trim() !== ''
    )
    .map((item) => item.trim());
};

const HeroSection = ({ data }: IHeroSectionProps) => {
  console.log(data);
  /* 1st priority: banner_images (max 3) */
  const bannerList = normalizeImages(data?.bannerImages).slice(0, 3);

  /* 2nd priority (only when banner_images is empty): service_detail_banner_image */
  const defaultImage = data?.heroImage?.trim();

  const images =
    bannerList.length > 0 ? bannerList : defaultImage ? [defaultImage] : [];

  return (
    <section className={hero}>
      {/* ---- Breadcrumb ---- */}
      <div className={breadcrumbWrap}>
        <div className={breadcrumb}>
          <Link href="/">Home</Link>
          <FaChevronRight />
          <Link href="/services">Services</Link>
          <FaChevronRight />
          <span>{data?.heroTitle}</span>
        </div>
      </div>

      {/* ---- Banner images (1 / 2 / 3) ---- */}
      {images.length > 0 && (
        <div className={imagesGrid} data-count={images.length}>
          {images.map((imgSrc, index) => (
            <div key={index} className={imageItem}>
              <div className={imageBox}>
                <Image
                  src={toUrl(imgSrc)}
                  alt={`${data?.heroTitle || 'banner'} ${index + 1}`}
                  fill
                  sizes={
                    images.length === 1
                      ? '100vw'
                      : images.length === 2
                        ? '50vw'
                        : '(max-width: 640px) 50vw, 33vw'
                  }
                  priority={index === 0}
                  unoptimized
                />
                <div className={imageOverlay} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---- Title area ---- */}
      <div className={headerWrap}>
        <span className={badge}>
          <FaHandHoldingHeart /> SERVICE
        </span>
        <h1 className={title}>{data?.heroTitle}</h1>
        {data?.heroSubTitle ? (
          <h2 className={subTitle}>{data.heroSubTitle}</h2>
        ) : null}
      </div>
    </section>
  );
};

export default HeroSection;