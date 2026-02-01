'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

import { Button } from '@/shared/components';
import { IServiceSectionData } from '@/shared/types/ServiceSection';

import { ServiceCard } from '../ServiceCard';
import style from './serviceSection.module.scss';

const {
  serviceSection,
  layout,
  contentContainer,
  services,
  content,
  text,
  serviceOne,
  serviceTwo,
  serviceThree,
  serviceFour,
  vLineOne,
  vLineTwo,
  hLineOne,
  hLineTwo,
  squareBox,
} = style;

interface IServiceSectionProps {
  serviceData: IServiceSectionData[];
}

const ServiceSection = ({ serviceData }: IServiceSectionProps) => {
  return (
    <div className={serviceSection}>
      <div className={layout} />
      <div className={contentContainer}>
        <div className={services}>
          {serviceData?.map((data) => (
            <Link
              key={data.id}
              href={
                data.title === 'Healthcare'
                  ? '/services#healthcare'
                  : data.title === 'Well-Being'
                    ? '/services#well-being'
                    : data.title === 'Emergency Response'
                      ? '/services#emergency-response'
                      : data.title === 'Social Business'
                        ? '/services#social-business'
                        : '#'
              }
            >
              <motion.div
                style={{ position: 'relative' }}
                initial={{ opacity: 0, bottom: '-5rem' }}
                whileInView={{ opacity: 1, bottom: '0' }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className={
                  data.id === 1
                    ? `${serviceOne}`
                    : data.id === 2
                      ? `${serviceTwo}`
                      : data.id === 3
                        ? `${serviceThree}`
                        : data.id === 4
                          ? `${serviceFour}`
                          : ''
                }
              >
                <ServiceCard service={data} />
              </motion.div>
            </Link>
          ))}
          <div className={vLineOne} />
          <div className={vLineTwo} />
          <div className={hLineOne} />
          <div className={hLineTwo} />
          <div className={squareBox} />
        </div>
        <div className={content}>
          <motion.h2
            style={{ position: 'relative' }}
            initial={{ opacity: 0, bottom: '-5rem' }}
            whileInView={{ opacity: 1, bottom: '0' }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className={text}
          >
            Millions of People at Bottom of the Pyramid are Served with Empathy
            and Care
          </motion.h2>
          <motion.div
            style={{ position: 'relative' }}
            initial={{ opacity: 0, bottom: '-5rem' }}
            whileInView={{ opacity: 1, bottom: '0' }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Button text="read more" url="/services" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ServiceSection;
