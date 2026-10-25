'use client';

// ================= START: replace top part =================
/* eslint-disable comma-dangle */

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
// ================= START: imports =================
import { FaLocationDot, FaPhone, FaEnvelope } from 'react-icons/fa6';

import officeIcon from '@/assets/images/favicon.png';
import { IOfficeLocationsProps } from './OfficeLocations.types';
import style from './officeLocations.module.scss';
// ================== END: imports ==================

// ================== END: replace top part ==================

const OfficeLocations = ({ officeLocationsData }: IOfficeLocationsProps) => {

  return (
    // ================= START: replace JSX inside return =================
    <section className={style.mainContainer}>
      {/* Soft background decoration */}
      <div className={style.decor} aria-hidden="true">
        <span className={style.glowLeft} />
        <span className={style.dotsRight} />
      </div>

      <div className={style.container}>
        {/* ---------- Title ---------- */}
        <motion.div
          className={style.titleWrap}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={style.heading}>
            Regional Office <span>across Bangladesh</span>
          </h2>
          <motion.span
            className={style.titleBar}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          />
        </motion.div>

        {/* ---------- Cards ---------- */}
        <div className={style.cards}>
          {officeLocationsData?.map((data, i) => {
            const email = (data as { email_address?: string }).email_address;

            return (
              <motion.div
                className={style.card}
                key={data.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, delay: 0.1 * (i % 4) },
                }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                viewport={{ once: true, amount: 0.15 }}
              >
                {/* Title + image (right side) */}
                <div className={style.header}>
                  <h3>{data.title}</h3>
                  <span className={style.logo}>
                    <Image
                      src={officeIcon}
                      alt="Grameen Kalyan"
                      width={64}
                      height={64}
                    />
                  </span>
                </div>

                {/* Address, contact, email */}
                <div className={style.info}>
                  <Link
                    className={style.row}
                    href={data.map_location}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className={style.rowIcon}>
                      <FaLocationDot />
                    </span>
                    <span>{data.address}</span>
                  </Link>

                  <p className={style.row}>
                    <span className={style.rowIcon}>
                      <FaPhone />
                    </span>
                    <span>{data.contact_info}</span>
                  </p>

                  {email && (
                    <a className={style.row} href={`mailto:${email}`}>
                      <span className={style.rowIcon}>
                        <FaEnvelope />
                      </span>
                      <span>{email}</span>
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
    // ================== END: replace JSX inside return ==================
  );
};

export default OfficeLocations;
