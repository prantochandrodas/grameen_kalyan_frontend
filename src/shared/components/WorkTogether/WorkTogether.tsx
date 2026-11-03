'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

import testImage from '@/assets/images/lets-work.jpeg';
import style from './workTogether.module.scss';

const {
  workTogether,
  shell,
  media,
  photo,
  mediaTint,
  panel,
  heading,
  highlight,
  parag,
  actions,
  button,
} = style;

const BASE_URL = 'https://admin.grameenkalyan.com';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
});

const getImageSrc = (image?: string | null) => {
  if (!image) return testImage; // fallback to local image
  if (image.startsWith('http')) return image; // already a full URL
  return `${BASE_URL}${image.startsWith('/') ? '' : '/'}${image}`;
};

interface IWorkTogetherProps {
  image?: string | null;
}

const WorkTogether = ({ image }: IWorkTogetherProps) => (
  <section className={workTogether}>
    <div className={shell}>
      <motion.div {...fadeUp(0)} className={media}>
        <Image
          className={photo}
          src={getImageSrc(image)}
          alt="Our team and partners working together"
          fill
          sizes="(max-width: 1024px) 100vw, 68vw"
        />
        <span className={mediaTint} />
      </motion.div>

      <motion.div {...fadeUp(0.15)} className={panel}>
        <h3 className={heading}>
          Let&rsquo;s Work <span className={highlight}>Together</span>
        </h3>

        <p className={parag}>
          Our promise is that everyone at the Bottom of the Pyramid will have
          equal access to standard healthcare. We welcome partnerships and
          collaboration to build a better future together.
        </p>

        <p className={parag}>
          Reach out to learn more about partnership and collaboration
          opportunities.
        </p>

        <div className={actions}>
          <Link href="/join-us" className={button}>
            Join Us
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

export default WorkTogether;