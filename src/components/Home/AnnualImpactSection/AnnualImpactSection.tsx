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

import style from './annualImpact.module.scss';

const BASE_URL = 'https://admin.grameenkalyan.com';

// API theke image na ashle ei fallback image dekhabe
const fallbackImage =
    'https://res.cloudinary.com/dboyf6lad/image/upload/v1692613874/about-annual_u4175k.jpg';

interface IStat {
    title: string;
    value: string | number;
}

interface IAnnualImpactProps {
    serveData?: IStat[]; // annually_we_serve data (AnnuallyServe er data)
    data?: IStat[]; // baki stat gulo (AnnualReportSection er data)
    image?: string; // annually_serve image (homePageContentData theke)
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

// "750,000" ba 750000 duto-i handle korbe
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

// Viewport e ashle 0 theke target porjonto count korbe (ekbar-i)
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
            // state na use kore sorasori DOM update, tai re-render hobe na
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

const AnnualImpactSection = ({ serveData = [], data = [], image }: IAnnualImpactProps) => {
    const [annuallyServeData] = serveData;

    // image na thakle fallback, absolute URL hole sheta-i, relative hole backend base URL jog hobe
    const imageSrc = image
        ? image.startsWith('http')
            ? image
            : `${BASE_URL}${image}`
        : fallbackImage;

    return (
        <section className={style.section}>
            <div className={style.card}>
                <div className={style.left}>
                    <p className={style.totalTitle}>{annuallyServeData?.title}</p>
                    <motion.p
                        className={style.totalNumber}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <CountUp value={annuallyServeData?.value ?? 0} duration={2.5} />
                    </motion.p>
                    <p className={style.totalSub}>People Across the Country</p>
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

export default AnnualImpactSection;