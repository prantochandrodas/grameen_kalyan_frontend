'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiShield, FiHeart, FiUsers, FiArrowRight } from 'react-icons/fi';
import { FaLeaf } from 'react-icons/fa';
import { IMAGE_BASE_URL } from '@/config';
import style from './microHealthSection.module.scss';

const {
  microHealthSection,
  bgContainer,
  img,
  content,
  title,
  subtitle,
  cta,
  features,
  featureItem,
  iconWrap,
} = style;

interface IMicroHealthSectionProps {
  image: string;
}

const FEATURES = [
  { label: 'Financial Security', Icon: FiShield },
  { label: 'Better Healthcare', Icon: FiHeart },
  { label: 'Community Wellbeing', Icon: FiUsers },
  { label: 'Sustainable Future', Icon: FaLeaf },
];

const MicroHealthSection = ({ image }: IMicroHealthSectionProps) => {
  return (
    <section className={microHealthSection}>
      <div className={bgContainer}>
        <Image
          className={img}
          src={IMAGE_BASE_URL + image} // production: IMAGE_BASE_URL + image
          alt="Micro Health Insurance"
          width={1920}
          height={600}
          priority
        />
      </div>

      <div className={content}>
        <h2 className={title}>Micro Health Insurance</h2>
        <p className={subtitle}>
          Affordable healthcare. Stronger communities.
          <br />
          A sustainable future.
        </p>
        <Link href="/healthcare/4" className={cta}>
          Learn More <FiArrowRight />
        </Link>
      </div>

      <div className={features}>
        {FEATURES.map(({ label, Icon }) => (
          <div key={label} className={featureItem}>
            <span className={iconWrap}>
              <Icon />
            </span>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MicroHealthSection;