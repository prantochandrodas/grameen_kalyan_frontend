// ================= START: replace top part =================
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

import { IHealthcareService } from '@/shared/types/healthcareService';
import { IMAGE_BASE_URL } from '@/config';

import style from './healthcareService.module.scss';

// ================== END: replace top part ==================

interface IHealthcareServiceProps {
  servicesData: IHealthcareService[];
}

const HealthcareService = ({ servicesData }: IHealthcareServiceProps) => {
  return (
    // ================= START: replace JSX inside return =================
    <section className={style.healthcareService}>
      {/* Soft background decoration */}
      <div className={style.decor} aria-hidden="true">
        <span className={style.glowLeft} />
        <span className={style.dotsRight} />
      </div>

      <div className={style.container}>
        {/* ---------- Title ---------- */}
        <motion.div
          className={style.titleWrap}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className={style.eyebrow}>What We Offer</span>
          <h2 className={style.title}>
            Our <span>Services</span>
          </h2>
          <span className={style.titleBar} />
        </motion.div>

        {/* ---------- Cards ---------- */}
        <div className={style.cards}>
          {servicesData?.map((data, index) => {
            return (
              <Link
                key={data.id}
                href={`/healthcare/${data.id}`}
                className={style.card}
              >
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * (index % 4) }}
                  className={style.cardInner}
                >
                  <div className={style.photo}>
                    <Image
                      src={IMAGE_BASE_URL + data.thumb_image}
                      alt={data.title || 'healthcare'}
                      width={500}
                      height={500}
                    />
                  </div>


                  <h3>{data.title}</h3>

                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
    // ================== END: replace JSX inside return ==================
  );
};

export default HealthcareService;
