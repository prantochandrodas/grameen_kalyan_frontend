'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

import testImage from '@/assets/images/lets-work.jpeg';
import { Button } from '../Button';
import style from './workTogether.module.scss';

const {
  workTogether,
  imgContainer,
  img,
  contentContainer,
  heading,
  highlight,
  parag,
  actions,
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
    <motion.div {...fadeUp(0)} className={imgContainer}>
      <Image
        className={img}
        src={getImageSrc(image)}
        alt="Our team and partners working together"
        width={1600}
        height={1000}
        sizes="(max-width: 900px) 100vw, 62vw"
      />
    </motion.div>

    <div className={contentContainer}>
      <motion.h3 {...fadeUp(0.15)} className={heading}>
        Let&apos;s Work <span className={highlight}>Together</span>
      </motion.h3>

      <motion.p {...fadeUp(0.2)} className={parag}>
        Our promise is that everyone at the Bottom of the Pyramid will have
        equal access to standard healthcare. We welcome partnerships and
        collaboration to build a better future together.
      </motion.p>

      <motion.p {...fadeUp(0.3)} className={parag}>
        Reach out to learn more about partnership and collaboration
        opportunities.
      </motion.p>

      <motion.div {...fadeUp(0.4)} className={actions}>
        <Button text="Join Us" url="/join-us" />
      </motion.div>
    </div>
  </section>
);

export default WorkTogether;