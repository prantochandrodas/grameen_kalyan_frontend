'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import style from './NewsEventsListing.module.scss';
import useFetchLaravelData from '@/shared/hook/useFetchData/useFetchData';

const {
    section, header, heading, desc, grid, card, imageBox, dateBadge,
    day, month, cardBody, title, bottomRow, arrowBtn, loader, emptyState,
} = style;

interface NewsEventItem {
    id: number;
    title: string;
    date_day: string;
    date_month: string;
    short_description: string;
    image: string | null;
}

interface Meta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    has_more: boolean;
}

const ArrowIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const NewsEventsListing = () => {
    const [items, setItems] = useState<NewsEventItem[]>([]);
    const [meta, setMeta] = useState<Meta | null>(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [initialLoaded, setInitialLoaded] = useState(false);

    const observerRef = useRef<IntersectionObserver | null>(null);
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    const fetchPage = useCallback(async (pageNum: number) => {
        setLoading(true);
        try {
            const res = await useFetchLaravelData({
                url: `/news-events?page=${pageNum}&per_page=9`,
            });
            if (res?.data) {
                setItems((prev) => (pageNum === 1 ? res.data : [...prev, ...res.data]));
                setMeta(res.meta ?? null);
            }
        } finally {
            setLoading(false);
            setInitialLoaded(true);
        }
    }, []);

    // Prothom page load
    useEffect(() => {
        fetchPage(1);
    }, [fetchPage]);

    // Scroll kore last item er kache ashle next page load (IntersectionObserver)
    useEffect(() => {
        if (!meta?.has_more || loading) return undefined;

        const el = sentinelRef.current;
        if (!el) return undefined;

        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setPage((prev) => prev + 1);
                }
            },
            { rootMargin: '200px' }
        );

        observerRef.current.observe(el);

        return () => {
            observerRef.current?.disconnect();
        };
    }, [meta?.has_more, loading]);

    // page state change hole shei page fetch kora
    useEffect(() => {
        if (page > 1) {
            fetchPage(page);
        }
    }, [page, fetchPage]);

    return (
        <section className={section}>
            <div className={header}>
                <h1 className={heading}>News & Events</h1>
                <p className={desc}>
                    Stay informed about our latest activities, success stories and upcoming events.
                </p>
            </div>

            {initialLoaded && !items.length && (
                <div className={emptyState}>No news or events found.</div>
            )}

            <div className={grid}>
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
                                <p>{item.short_description}</p>
                                <div className={bottomRow}>
                                    <span className={arrowBtn}>
                                        <ArrowIcon />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            {/* Sentinel element — eta viewport e ashle next page load hobe */}
            {meta?.has_more && <div ref={sentinelRef} style={{ height: 1 }} />}

            {loading && <div className={loader}>Loading more...</div>}
        </section>
    );
};

export default NewsEventsListing;