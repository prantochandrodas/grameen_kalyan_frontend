'use client';

import React, { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import Link from 'next/link';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import style from './NewsEventSection.module.scss';
import useFetchLaravelData from '@/shared/hook/useFetchData/useFetchData';

const {
    section, wrapper, leftCol, tag, heading, desc, viewAllBtn,
    sliderCol, navBtns, navBtn, navBtnNext, navBtnDisabled, card, imageBox, dateBadge,
    day, month, cardBody, title, bottomRow, arrowBtn,
} = style;

interface NewsEventItem {
    id: number;
    title: string;
    date_day: string;
    date_month: string;
    image: string | null;
}

const ArrowIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ChevronIcon = ({ flip }: { flip?: boolean }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ transform: flip ? 'rotate(180deg)' : undefined }}>
        <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// slidesToShow ke items.length er beshi hote deya jabe na
const getSlidesToShow = (itemCount: number, want: number) => Math.max(1, Math.min(want, itemCount));

// slick breakpoint er sathe mil rekhe: <=640 mobile, <=1024 tablet
const getWantedSlides = () => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth <= 640) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
};

const NewsEventSection = () => {
    const [items, setItems] = useState<NewsEventItem[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [wantedSlides, setWantedSlides] = useState(3);
    const sliderRef = useRef<Slider>(null);

    useEffect(() => {
        const fetchNewsEvents = async () => {
            const res = await useFetchLaravelData({ url: '/news-events/slider?limit=10' });
            if (res?.data) setItems(res.data);
        };
        fetchNewsEvents();
    }, []);

    useEffect(() => {
        const update = () => setWantedSlides(getWantedSlides());
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    const desktopSlides = getSlidesToShow(items.length, 3);
    const tabletSlides = getSlidesToShow(items.length, 2);
    const mobileSlides = getSlidesToShow(items.length, 1);

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: desktopSlides,
        slidesToScroll: 1,
        arrows: false,
        afterChange: (index: number) => setCurrentSlide(index),
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: tabletSlides, infinite: false } },
            { breakpoint: 640, settings: { slidesToShow: mobileSlides, infinite: false } },
        ],
    };

    if (!items.length) return null;

    const visibleSlides = getSlidesToShow(items.length, wantedSlides);
    const maxSlideIndex = Math.max(0, items.length - visibleSlides);
    const showNav = items.length > visibleSlides;
    const isPrevDisabled = currentSlide <= 0;
    const isNextDisabled = currentSlide >= maxSlideIndex;

    return (
        <section className={section}>
            <div className={wrapper}>
                <div className={leftCol}>
                    <span className={tag}>— NEWS & EVENTS</span>
                    <h2 className={heading}>Latest Updates</h2>
                    <p className={desc}>
                        Stay informed about our latest activities, success stories and upcoming events.
                    </p>
                    <Link href="/news-events" className={viewAllBtn}>
                        View All <ArrowIcon />
                    </Link>
                </div>

                <div className={sliderCol}>
                    {showNav && (
                        <div className={navBtns}>
                            <button
                                type="button"
                                className={`${navBtn} ${isPrevDisabled ? navBtnDisabled : ''}`}
                                aria-label="Previous"
                                onClick={() => sliderRef.current?.slickPrev()}
                            >
                                <ChevronIcon flip />
                            </button>
                            <button
                                type="button"
                                className={`${navBtn} ${navBtnNext} ${isNextDisabled ? navBtnDisabled : ''}`}
                                aria-label="Next"
                                onClick={() => sliderRef.current?.slickNext()}
                            >
                                <ChevronIcon />
                            </button>
                        </div>
                    )}

                    <Slider ref={sliderRef} {...settings}>
                        {items.map((item) => (
                            <div key={item.id} className={card}>
                                <Link href={`/news-events/${item.id}`} prefetch={false}>
                                    <div className={imageBox}>
                                        {item.image && <img src={item.image} alt={item.title} />}
                                        <div className={dateBadge}>
                                            <span className={day}>{item.date_day}</span>
                                            <span className={month}>{item.date_month}</span>
                                        </div>
                                    </div>
                                    <div className={cardBody}>
                                        <h3 className={title}>{item.title}</h3>
                                        <div className={bottomRow}>
                                            <span className={arrowBtn}>
                                                <ArrowIcon />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </section>
    );
};

export default NewsEventSection;