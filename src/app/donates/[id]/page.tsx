import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
    FaHandHoldingHeart,
    FaShareAlt,
    FaChevronRight,
    FaShieldAlt,
    FaUsers,
    FaHeart,
} from 'react-icons/fa';
import useFetchLaravelData from '@/shared/hook/useFetchData/useFetchData';
import { IMAGE_BASE_URL } from '@/config';

import style from './DonateDetails.module.scss';

const {
    section,
    blobGreen,
    blobGold,
    breadcrumb,
    imagesGrid,
    imageItem,
    imageBox,
    imageOverlay,
    imageName,
    container,
    headerRow,
    topRow,
    badgeLine,
    badge,
    shareBtn,
    title,
    subTitle,
    trustStrip,
    trustItem,
    contentBox,
    cornerAccent,
    description,
    Breadcrumbcontainer,
} = style;


interface IDonateDetail {
    id: number;
    name: string;
    title: string;
    description: string;
    images: string[];
}

interface IDonateResponse {
    success: boolean;
    data: IDonateDetail;
    message?: string;
}

export default async function DonateDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const res: IDonateResponse = await useFetchLaravelData({
        url: `/donates/${params.id}`,
    });

    if (!res?.success || !res?.data) {
        notFound();
    }

    const donate = res.data;
    const images = Array.isArray(donate.images) ? donate.images : [];

    return (
        <section className={section}>
            {/* decorative background blobs */}
            <span className={blobGreen} />
            <span className={blobGold} />

            {/* ---- Breadcrumb ---- */}
            <div className={Breadcrumbcontainer}>
                <div className={breadcrumb}>
                    <Link href="/">Home</Link>
                    <FaChevronRight />
                    <span>Donate</span>
                    <FaChevronRight />
                    <span>{donate.name}</span>
                </div>
            </div>

            {/* ---- Image section: sobar upore, full width, premium overlay ---- */}
            {images.length > 0 && (
                <div className={imagesGrid}>
                    {images.map((imgSrc, index) => (
                        <div key={index} className={imageItem}>
                            <div className={imageBox}>
                                <Image
                                    src={
                                        imgSrc?.startsWith('http')
                                            ? imgSrc
                                            : `${IMAGE_BASE_URL}${imgSrc}`
                                    }
                                    alt={`${donate.name} image ${index + 1}`}
                                    fill
                                    sizes="100vw"
                                    priority={index === 0}
                                />
                                {/* screenshot er moto niche theke gradient + name */}
                                <div className={imageOverlay} />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ---- Text content ---- */}
            <div className={container}>
                <div className={headerRow}>
                    <span className={badgeLine}>
                        <span className={badge}>
                            <FaHandHoldingHeart /> DONATE
                        </span>
                    </span>
                    <h1 className={title}>{donate.name}</h1>
                    {donate.title ? <h2 className={subTitle}>{donate.title}</h2> : null}
                </div>

                {donate.description ? (
                    <div className={contentBox}>
                        <span className={cornerAccent} />
                        <div
                            className={description}
                            dangerouslySetInnerHTML={{ __html: donate.description }}
                        />
                    </div>
                ) : null}
            </div>


        </section>
    );
}