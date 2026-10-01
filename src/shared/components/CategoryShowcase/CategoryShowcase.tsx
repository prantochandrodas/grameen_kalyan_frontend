'use client';

import React, { ReactNode, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    ArrowRight,
    Baby,
    Bug,
    FileText,
    Heart,
    Ribbon,
    ShieldCheck,
    Stethoscope,
    User,
} from 'lucide-react';

import { IMAGE_BASE_URL } from '@/config';
import { ICategory } from '@/shared/types/category';

import style from './categoryShowcase.module.scss';

export type IShowcaseItem = ICategory & { dataType?: string };

interface ICategoryShowcaseProps {
    data?: IShowcaseItem[];
    /** Optional content shown above the pills in the left column (heading etc). */
    intro?: ReactNode;
    /** Medical-care pages: changes the last card label to "More Health Care". */
    primary?: boolean;
}

// Icon chosen by keyword in the category name (falls back to the heart icon).
const META: { match: RegExp; icon: React.ElementType }[] = [
    { match: /emergency/i, icon: User },
    { match: /pandemic/i, icon: Bug },
    { match: /diagnosis/i, icon: Stethoscope },
    { match: /compliance/i, icon: ShieldCheck },
    { match: /mother|child/i, icon: Baby },
    { match: /cancer/i, icon: Ribbon },
];

const getIcon = (name = ''): React.ElementType =>
    META.find((m) => m.match.test(name))?.icon ?? Heart;

const getHref = (item: IShowcaseItem) => {
    if (item.dataType === 'medical') return `/medical-care/${item.id}`;
    if (item.dataType === 'story') return `/stories/${item.id}`;
    return '#';
};

const getMoreHref = (type?: string) => {
    if (type === 'medical') return '/medical-care-list';
    if (type === 'story') return '/story-list';
    return '#';
};

const CategoryShowcase = ({ data, intro, primary }: ICategoryShowcaseProps) => {
    const items = data ?? [];
    const [activeIndex, setActiveIndex] = useState(0);
    const active = items[activeIndex];

    const left = items.slice(0, 3);
    const right = items.slice(3, 6);

    const renderItem = (
        item: IShowcaseItem,
        index: number,
        kind: 'pill' | 'card'
    ) => {
        const Icon = getIcon(item.name);
        return (
            <Link
                key={item.id}
                href={getHref(item)}
                className={`${style.item} ${kind === 'pill' ? style.pill : style.card} ${index === activeIndex ? style.active : ''
                    }`}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
            >
                <span className={style.iconWrap}>
                    <Icon size={22} strokeWidth={2} />
                </span>
                <span className={style.text}>
                    <span className={style.title}>{item.name}</span>
                </span>
                <ArrowRight className={style.arrow} size={18} />
            </Link>
        );
    };

    return (
        <div className={style.showcase}>
            <div className={style.stage}>
                <div className={`${style.column} ${style.leftColumn}`}>
                    {intro && <div className={style.intro}>{intro}</div>}
                    <div className={style.pills}>
                        {left.map((d, i) => renderItem(d, i, 'pill'))}
                    </div>
                </div>

                <div className={style.circleWrap}>
                    <div className={style.circle}>
                        {active?.banner_image && (
                            <Image
                                key={active.id}
                                className={style.circleImg}
                                src={IMAGE_BASE_URL + active.banner_image}
                                alt={active.name}
                                fill
                                sizes="(max-width: 600px) 80vw, 45rem"
                            />
                        )}
                    </div>
                </div>

                <div className={`${style.column} ${style.rightColumn}`}>
                    {right.map((d, i) => renderItem(d, i + 3, 'card'))}
                    <Link
                        href={getMoreHref(items[0]?.dataType)}
                        className={`${style.item} ${style.card}`}
                    >
                        <span className={style.iconWrap}>
                            <FileText size={22} strokeWidth={2} />
                        </span>
                        <span className={style.text}>
                            <span className={style.title}>
                                {primary ? 'More Health Care' : 'More Stories'}
                            </span>
                        </span>
                        <ArrowRight className={style.arrow} size={18} />
                    </Link>
                </div>
            </div>

            <div className={style.dots} role="tablist" aria-label="Categories">
                {items.map((d, i) => (
                    <button
                        key={d.id}
                        type="button"
                        role="tab"
                        aria-selected={i === activeIndex}
                        aria-label={d.name}
                        className={`${style.dot} ${i === activeIndex ? style.dotActive : ''}`}
                        onClick={() => setActiveIndex(i)}
                    />
                ))}
            </div>
        </div>
    );
};

export default CategoryShowcase;
