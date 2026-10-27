'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaStethoscope, FaUsers, FaShieldAlt, FaArrowRight } from 'react-icons/fa';

import { Button } from '@/shared/components';
import { IServiceSectionData } from '@/shared/types/ServiceSection';
import { IAboutdata } from '../AboutSection/aboutData.type';

import style from './journeySection.module.scss';

interface IJourneySectionProps {
    about: IAboutdata;
    serviceData: IServiceSectionData[];
}

type Theme = {
    cls: string;
    Icon: React.ElementType;
};

// 1st & 3rd card -> green, 2nd & 4th card -> orange
const DEFAULT_THEME: Theme = {
    cls: 'green',
    Icon: FaStethoscope,
};

const THEMES: Record<string, Theme> = {
    Healthcare: DEFAULT_THEME,
    'Well-Being': {
        cls: 'orange',
        Icon: FaUsers,
    },
    'Emergency Response': {
        cls: 'green',
        Icon: FaShieldAlt,
    },
    'Social Business': {
        cls: 'orange',
        Icon: FaUsers,
    },
};

const IMAGE_BASE = 'https://admin.grameenkalyan.com';

const getImageSrc = (src?: string) => {
    if (!src) return '';
    if (src.startsWith('http')) return src;
    return `${IMAGE_BASE}${src.startsWith('/') ? '' : '/'}${src}`;
};

const JourneySection = ({ about, serviceData }: IJourneySectionProps) => {
    // title: "29+ Years" -> "29+" (gold) + "Years"
    const [num, ...rest] = (about?.title || '').split(' ');

    return (
        <section className={style.journey}>
            {/* Soft background decoration */}
            <div className={style.decor} aria-hidden="true">
                <span className={style.glowLeft} />
                <span className={style.dotsRight} />
            </div>

            {/* ---------- Left column ---------- */}
            <div className={style.intro}>
                <motion.span
                    className={style.eyebrow}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    Our Journey
                </motion.span>

                <motion.h2
                    className={style.heading}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <span className={style.num}>{num}</span> {rest.join(' ')}
                </motion.h2>

                <motion.h4
                    className={style.sub}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    {about?.subTitleOne}
                </motion.h4>

                <p className={style.para}>{about?.subTitleTwo}</p>

                {/* Statement + button */}
                <div className={style.bottom}>
                    <motion.h3
                        className={style.statement}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        Millions of People at{' '}
                        <span className={style.highlight}>Bottom of the Pyramid</span>{' '}
                        are Served with Empathy and Care
                    </motion.h3>

                    <motion.div
                        className={style.btnWrap}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Button text="read more" url="/services" />
                    </motion.div>
                </div>
            </div>

            {/* ---------- Right column: cards ---------- */}
            <div className={style.cards}>
                {serviceData?.map((data: any, i: number) => {
                    const theme = THEMES[data.title] ?? DEFAULT_THEME;
                    const Icon = theme.Icon;
                    const imgSrc = getImageSrc(data.homepage_thumb_image);

                    // 1st & 3rd -> green, 2nd & 4th -> orange (by position)
                    const tone = i % 2 === 0 ? 'green' : 'orange';

                    // same links as navbar: healthcare has its own page, others open by id
                    const href =
                        data.title === 'Healthcare' ? '/healthcare' : `/services/${data.id}`;

                    return (
                        <Link
                            key={data.id ?? i}
                            href={href}
                            data-tone={tone}
                            aria-label={`Open ${data.title}`}
                            className={`${style.card} ${style[tone] ?? ''}`}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.1 * i }}
                                className={style.cardInner}
                            >
                                <div className={style.photo}>
                                    {imgSrc && (
                                        <Image
                                            src={imgSrc}
                                            alt={data.title}
                                            fill
                                            sizes="300px"
                                            unoptimized
                                        />
                                    )}
                                </div>

                                <span className={style.icon}>
                                    <Icon />
                                </span>

                                <h3>{data.title}</h3>
                                {/* <p>{theme.desc}</p> */}

                                <span className={style.arrow}>
                                    <FaArrowRight />
                                </span>
                            </motion.div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
};

export default JourneySection;