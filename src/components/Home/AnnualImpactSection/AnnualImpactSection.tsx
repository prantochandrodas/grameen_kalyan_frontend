'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
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

const format = (v: string | number = 0) => Number(v).toLocaleString('en-US');

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
                        {format(annuallyServeData?.value)}+
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
                                <span className={style.number}>{format(item.value)}+</span>
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