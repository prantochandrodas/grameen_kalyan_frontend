'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Baby,
  FileText,
  Heart,
  Ribbon,
  ShieldCheck,
  Stethoscope,
  User,
  Bug,
} from 'lucide-react';

import { IMAGE_BASE_URL } from '@/config';

import { IStoriesSectionProps } from './StoriesSection.types';
import { ICategory } from '@/shared/types/category';
import style from './storiesSection.module.scss';

// Icon chosen by keyword in the category name (falls back to the heart icon).
const META: { match: RegExp; icon: React.ElementType }[] = [
  { match: /emergency/i, icon: User },
  { match: /pandemic/i, icon: Bug },
  { match: /diagnosis/i, icon: Stethoscope },
  { match: /compliance/i, icon: ShieldCheck },
  { match: /mother|child/i, icon: Baby },
  { match: /cancer/i, icon: Ribbon },
  { match: /more/i, icon: FileText },
];

const getMeta = (name = '') =>
  META.find((m) => m.match.test(name)) ?? { icon: Heart };

const StoriesSection = ({ storyCategory }: IStoriesSectionProps) => {
  const items: ICategory[] = storyCategory ?? [];
  const [activeIndex, setActiveIndex] = useState(0);
  const active = items[activeIndex];

  const left = items.slice(0, 3);
  const right = items.slice(3, 6);

  const renderItem = (data: ICategory, index: number, side: 'left' | 'right') => {
    const { icon: Icon } = getMeta(data.name);
    return (
      <Link
        key={data.id}
        href={`/stories/${data.id}`}
        className={`${style.item} ${side === 'right' ? style.card : style.pill} ${index === activeIndex ? style.active : ''
          }`}
        onMouseEnter={() => setActiveIndex(index)}
        onFocus={() => setActiveIndex(index)}
      >
        <span className={style.iconWrap}>
          <Icon size={22} strokeWidth={2} />
        </span>
        <span className={style.text}>
          <span className={style.title}>{data.name}</span>
        </span>
        <ArrowRight className={style.arrow} size={18} />
      </Link>
    );
  };

  return (
    <section className={style.storiesSection}>
      <div className={style.inner}>
        <div className={style.stage}>
          <div className={`${style.column} ${style.leftColumn}`}>
            <div className={style.intro}>
              <p className={style.eyebrow}>Health Care | Community</p>
              <h2 className={style.heading}>
                <motion.span
                  style={{ position: 'relative' }}
                  initial={{ opacity: 0, bottom: '-5rem' }}
                  whileInView={{ opacity: 1, bottom: '0' }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className={style.small}
                >
                  Making Millions
                </motion.span>
                <motion.span
                  style={{ position: 'relative' }}
                  initial={{ opacity: 0, bottom: '-5rem' }}
                  whileInView={{ opacity: 1, bottom: '0' }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className={`${style.small} ${style.gold}`}
                >
                  Smile
                </motion.span>
              </h2>
              <p className={style.lead}>
                Grameen Kalyan works for better health, stronger families and a
                brighter future for all.
              </p>
            </div>
            <div className={style.pills}>
              {left.map((d, i) => renderItem(d, i, 'left'))}
            </div>
          </div>

          <div className={style.circleWrap}>
            <div className={style.circle}>
              {active?.banner_image && (
                <Image
                  key={active.id}
                  className={style.circleImg}
                  src={IMAGE_BASE_URL + active.banner_image}
                  alt={active.name}
                  fill
                  sizes="(max-width: 600px) 80vw, 45rem"
                />
              )}
            </div>
          </div>

          <div className={`${style.column} ${style.rightColumn}`}>
            {right.map((d, i) => renderItem(d, i + 3, 'right'))}
            <Link href="/story-list" className={`${style.item} ${style.card}`}>
              <span className={style.iconWrap}>
                <FileText size={22} strokeWidth={2} />
              </span>
              <span className={style.text}>
                <span className={style.title}>More Stories</span>
              </span>
              <ArrowRight className={style.arrow} size={18} />
            </Link>
          </div>
        </div>

        <div className={style.dots} role="tablist" aria-label="Story categories">
          {items.map((d, i) => (
            <button
              key={d.id}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={d.name}
              className={`${style.dot} ${i === activeIndex ? style.dotActive : ''}`}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StoriesSection;
