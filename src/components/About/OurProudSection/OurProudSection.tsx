'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, animate, useInView } from 'framer-motion';

const bgImage =
  'https://res.cloudinary.com/dboyf6lad/image/upload/v1692613875/proud-bg_bu0agc.jpg';

import style from './ourProudSection.module.scss';
import { IOurProudSection } from './ourProudSection.type';

const {
  annualSection,
  bgContainer,
  img,
  overlay,
  inner,
  heading,
  subHeading,
  gridContainer,
  card,
  number,
  title,
} = style;

const CountUp = ({ value }: { value: string | number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [count, setCount] = useState(0);

  const raw = String(value);
  const match = raw.match(/^(\D*)([\d,.]+)(.*)$/);
  const prefix = match?.[1] ?? '';
  const target = match ? parseFloat(match[2].replace(/,/g, '')) : NaN;
  const suffix = match?.[3] ?? '';
  const decimals = match?.[2].includes('.') ? match[2].split('.')[1].length : 0;
  const isYear = target >= 1900 && target <= 2100 && !suffix;
  const isStatic = Number.isNaN(target) || isYear;

  useEffect(() => {
    if (!inView || isStatic) return;
    const controls = animate(0, target, {
      duration: 1.8,
      ease: 'easeOut',
      onUpdate: (v) => setCount(v),
    });
    return () => controls.stop();
  }, [inView, isStatic, target]);

  return (
    <span ref={ref}>
      {isStatic
        ? raw
        : `${prefix}${count.toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })}${suffix}`}
    </span>
  );
};

const OurProudSection = ({
  proudPresenceData,
  headingText,
  subHeadingText,
}: IOurProudSection) => {
  return (
    <section className={annualSection}>
      <div className={bgContainer}>
        <Image
          className={img}
          src={bgImage}
          alt="Our proud presence background"
          fill
          sizes="100vw"
        />
      </div>
      <div className={overlay} />

      <div className={inner}>
        <h1 className={heading}>
          <span>{headingText}</span>
          <span className={subHeading}>{subHeadingText}</span>
        </h1>

        <div className={gridContainer}>
          {proudPresenceData.map((data, index) => (
            <motion.div
              key={data.id}
              className={card}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <span className={number}>
                <CountUp value={data.value} />
              </span>
              <span className={title}>{data.title}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurProudSection;
