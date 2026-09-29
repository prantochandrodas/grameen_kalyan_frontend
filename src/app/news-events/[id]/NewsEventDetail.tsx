'use client';

import React from 'react';
import Link from 'next/link';
import style from './NewsEventDetail.module.scss';

const {
    section, container, backLink, header, dateBadge, day, month, title,
    heroImage, card, content,
} = style;

interface NewsEventData {
    id: number;
    title: string;
    date: string;
    date_day: string;
    date_month: string;
    image: string | null;
    description: string | null;
}

const BackIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CalendarIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="5" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
        <path d="M8 3v4M16 3v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const NewsEventDetail = ({ data }: { data: NewsEventData }) => {
    return (
        <section className={section}>
            <div className={container}>
                <Link href="/news-events" className={backLink}>
                    <BackIcon /> Back to News & Events
                </Link>

                <div className={header}>
                    <div className={dateBadge}>
                        <CalendarIcon />
                        <span className={day}>{data.date_day}</span>
                        <span className={month}>{data.date_month}</span>
                    </div>
                    <h1 className={title}>{data.title}</h1>
                </div>

                {data.image && (
                    <div className={heroImage}>
                        <img src={data.image} alt={data.title} />
                    </div>
                )}

                {data.description && (
                    <article className={card}>
                        <div
                            className={content}
                            dangerouslySetInnerHTML={{ __html: data.description }}
                        />
                    </article>
                )}
            </div>
        </section>
    );
};

export default NewsEventDetail;