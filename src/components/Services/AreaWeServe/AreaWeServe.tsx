'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import areaIconOne from '@/assets/icons/area-icon-1.svg';
import areaIconTwo from '@/assets/icons/area-icon-2.svg';
import areaIconThree from '@/assets/icons/area-icon-3.svg';
import areaIconFour from '@/assets/icons/area-icon-4.svg';

import style from './areaWeServe.module.scss';

const {
  areaWeServeSection,
  contentContainer,
  eyebrow,
  heading,
  description,
  areaWeServeContainer,
  card,
  iconBadge,
  cardTitle,
  cardText,
  arrowBtn,
} = style;

const areas = [
  {
    title: 'Healthcare',
    text: 'Accessible and affordable healthcare for all.',
    href: '/services#healthcare',
    icon: areaIconOne,
  },
  {
    title: 'Well-Being',
    text: 'Mental, social and emotional well-being for stronger communities.',
    href: '/services#well-being',
    icon: areaIconTwo,
  },
  {
    title: 'Emergency Response',
    text: 'Rapid support during disasters and crises.',
    href: '/services#emergency-response',
    icon: areaIconThree,
  },
  {
    title: 'Social Business',
    text: 'Sustainable solutions for long-term development.',
    href: '/services#social-business',
    icon: areaIconFour,
  },
];

const AreaWeServe = () => {
  return (
    <section className={areaWeServeSection}>
      <div className={contentContainer}>


        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={heading}
        >
          Areas We Serve
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={description}
        >
          Enabling and empowering people
          to elevate themselves out of poverty
        </motion.p>
      </div>

      <div className={areaWeServeContainer}>
        {areas.map((area, i) => (
          <motion.div
            key={area.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 * i }}
          >
            <Link href={area.href} className={card}>
              <div className={iconBadge}>
                <Image src={area.icon} alt={area.title} width={46} height={46} />
              </div>

              <h3 className={cardTitle}>{area.title}</h3>

              <span className={arrowBtn} aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="#fff"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default AreaWeServe;