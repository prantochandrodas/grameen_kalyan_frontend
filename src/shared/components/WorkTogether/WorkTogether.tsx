'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

import testImage from '@/assets/images/lets-work.webp';
import { Button } from '../Button';

import style from './workTogether.module.scss';

const {
  workTogether,
  imgContainer,
  img,
  contentContainer,
  headingSmall,
  headingLarge,
  parag,
} = style;

const WorkTogether = () => {
  return (
    <div className={workTogether}>
      <div className={imgContainer}>
        <Image className={img} src={testImage} alt="img" />
      </div>
      <div className={contentContainer}>
        <motion.h3
          style={{ position: 'relative' }}
          initial={{ opacity: 0, bottom: '-5rem' }}
          whileInView={{ opacity: 1, bottom: '0' }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={headingSmall}
        >
          Let's Work
        </motion.h3>
        <motion.h3
          style={{ position: 'relative', marginBottom: '10px' }}
          initial={{ opacity: 0, bottom: '-5rem' }}
          whileInView={{ opacity: 1, bottom: '0' }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={headingSmall}
        >
          Together
        </motion.h3>
        <motion.p
          style={{ position: 'relative' }}
          initial={{ opacity: 0, bottom: '-5rem' }}
          whileInView={{ opacity: 1, bottom: '0' }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={parag}
        >
          Our promise is everyone at Bottom of the Pyramid will have equal
          access to standard healthcare. We welcome partnerships and
          collaboration to build a better future together.
        </motion.p>
        <motion.p
          style={{ position: 'relative' }}
          initial={{ opacity: 0, bottom: '-5rem' }}
          whileInView={{ opacity: 1, bottom: '0' }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={parag}
        >
          Reach out to know more about partnership and collaboration
          opportunities.
        </motion.p>
        <motion.div
          style={{ position: 'relative' }}
          initial={{ opacity: 0, bottom: '-5rem' }}
          whileInView={{ opacity: 1, bottom: '0' }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button text="Join Us" url="/join-us" btnSecondary={true} />
        </motion.div>
      </div>
    </div>
  );
};

export default WorkTogether;
