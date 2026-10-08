'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaStethoscope, FaUsers, FaShieldAlt, FaArrowRight } from 'react-icons/fa';

import { Button } from '@/shared/components';
import { IServiceSectionData } from '@/shared/types/ServiceSection';

import style from './serviceSection.module.scss';

interface IServiceSectionProps {
  serviceData: IServiceSectionData[];
}

type Theme = {
  cls: string;
  href: string;
  Icon: React.ElementType;
};

// 1st & 3rd card -> green, 2nd & 4th card -> orange
const DEFAULT_THEME: Theme = {
  cls: 'green',
  href: '/services#healthcare',
  Icon: FaStethoscope,
};

const THEMES: Record<string, Theme> = {
  Healthcare: DEFAULT_THEME,
  'Well-Being': {
    cls: 'orange',
    href: '/services#well-being',
    Icon: FaUsers,
  },
  'Emergency Response': {
    cls: 'green',
    href: '/services#emergency-response',
    Icon: FaShieldAlt,
  },
  'Social Business': {
    cls: 'orange',
    href: '/services#social-business',
    Icon: FaUsers,
  },
};

const IMAGE_BASE = 'https://admin.grameenkalyan.com';

const getImageSrc = (src?: string) => {
  if (!src) return '';
  if (src.startsWith('http')) return src;
  return `${IMAGE_BASE}${src.startsWith('/') ? '' : '/'}${src}`;
};

const ServiceSection = ({ serviceData }: IServiceSectionProps) => {
  return (
    <section className={style.service}>
      {/* Soft background decoration */}
      <div className={style.decor} aria-hidden="true">
        <span className={style.glowLeft} />
        <span className={style.dotsRight} />
      </div>

      {/* ---------- Left column: statement + button ---------- */}
      <div className={style.intro}>
        <div className={style.bottom}>
          <motion.h3
            className={style.statement}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Millions of People at{' '}
            <span className={style.highlight}>Bottom of the Pyramid</span>{' '}
            are Served with Empathy and Care
          </motion.h3>

          <motion.div
            className={style.btnWrap}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button text="read more" url="/services" />
          </motion.div>
        </div>
      </div>

      {/* ---------- Right column: cards ---------- */}
      <div className={style.cards}>
        {serviceData?.map((data: any, i: number) => {
          const theme = THEMES[data.title] ?? DEFAULT_THEME;
          const Icon = theme.Icon;
          const imgSrc = getImageSrc(data.homepage_thumb_image);

          return (
            <Link
              key={data.id ?? i}
              href={theme.href}
              className={`${style.card} ${style[theme.cls]}`}
            >
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                className={style.cardInner}
              >
                <div className={style.photo}>
                  {imgSrc && (
                    <Image
                      src={imgSrc}
                      alt={data.title}
                      fill
                      sizes="300px"
                      unoptimized
                    />
                  )}
                </div>

                <span className={style.icon}>
                  <Icon />
                </span>

                <h3>{data.title}</h3>

                <span className={style.arrow}>
                  <FaArrowRight />
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default ServiceSection;