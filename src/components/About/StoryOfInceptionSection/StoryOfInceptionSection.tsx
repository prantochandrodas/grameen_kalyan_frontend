'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, animate, useInView } from 'framer-motion';
import {
    FaStethoscope,
    FaPills,
    FaHome,
    FaClinicMedical,
    FaLaptopMedical,
    FaSyringe,
    FaShieldAlt,
    FaUsers,
} from 'react-icons/fa';

import style from './storyOfInception.module.scss';

const BASE_URL = 'https://admin.grameenkalyan.com';

// Fallback image if the API doesn't return one
const fallbackImage =
    'https://res.cloudinary.com/dboyf6lad/image/upload/v1692613874/about-annual_u4175k.jpg';

interface IStat {
    title: string;
    value: string | number;
}

interface IStoryOfInceptionProps {
    data?: IStat[]; // stats list (annuallyReportData)
    image?: string; // homePageContentData?.annually_serve
    headingText?: string;
}

const getIcon = (title: string = '') => {
    const t = title.toLowerCase();
    if (t.includes('diagnosis')) return <FaStethoscope />;
    if (t.includes('medicine')) return <FaPills />;
    if (t.includes('door')) return <FaHome />;
    if (t.includes('camp')) return <FaClinicMedical />;
    if (t.includes('digital')) return <FaLaptopMedical />;
    if (t.includes('vaccin')) return <FaSyringe />;
    if (t.includes('insurance')) return <FaShieldAlt />;
    return <FaUsers />;
};

// Handles both "750,000" and 750000
const toNumber = (v: string | number = 0) => {
    const n = Number(String(v).replace(/,/g, ''));
    return Number.isFinite(n) ? n : 0;
};

const formatNumber = (n: number) => Math.round(n).toLocaleString('en-US');

interface ICountUpProps {
    value: string | number;
    duration?: number;
    delay?: number;
    suffix?: string;
    className?: string;
}

// Counts from 0 to target once when it enters the viewport
const CountUp = ({ value, duration = 2, delay = 0, suffix = '+', className }: ICountUpProps) => {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-60px' });
    const target = toNumber(value);

    useEffect(() => {
        if (!isInView || !ref.current) return;

        const node = ref.current;

        const controls = animate(0, target, {
            duration,
            delay,
            ease: 'easeOut',
            onUpdate: (latest) => {
                node.textContent = `${formatNumber(latest)}${suffix}`;
            },
        });

        return () => controls.stop();
    }, [isInView, target, duration, delay, suffix]);

    return (
        <span ref={ref} className={className}>
            {`${formatNumber(0)}${suffix}`}
        </span>
    );
};

const StoryOfInceptionSection = ({
    data = [],
    image,
    headingText = 'Story of Inception',
}: IStoryOfInceptionProps) => {
    const imageSrc = image
        ? image.startsWith('http')
            ? image
            : `${BASE_URL}${image}`
        : fallbackImage;

    return (
        <section className={style.section}>
            <div className={style.card}>
                <div className={style.left}>
                    <motion.h2
                        className={style.heading}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        {headingText}
                    </motion.h2>
                </div>

                <ul className={style.list}>
                    {data.map((item, index) => (
                        <motion.li
                            key={index}
                            className={style.item}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.07 }}
                        >
                            <span className={style.icon}>{getIcon(item.title)}</span>
                            <span className={style.text}>
                                <CountUp
                                    className={style.number}
                                    value={item.value}
                                    duration={2}
                                    delay={index * 0.07}
                                />
                                <span className={style.title}>{item.title}</span>
                            </span>
                        </motion.li>
                    ))}
                </ul>

                <div className={style.imageWrap}>
                    <Image
                        className={style.img}
                        src={imageSrc}
                        alt="Health worker"
                        fill
                        sizes="(max-width: 900px) 100vw, 33vw"
                        priority
                    />
                </div>
            </div>
        </section>
    );
};

export default StoryOfInceptionSection;