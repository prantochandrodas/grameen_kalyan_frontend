import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { IStories } from '@/shared/types/stories';
import { IMAGE_BASE_URL } from '@/config';

import style from './medicalCareListSection.module.scss';

const {
  medicalCareList,
  grid,
  card,
  imageBox,
  img,
  placeholder,
  titleBox,
  title,
  empty,
} = style;

interface IMedicalCareListSectionProps {
  data: IStories[];
}

const MedicalCareListSection = ({ data }: IMedicalCareListSectionProps) => {
  const items = Array.isArray(data) ? data : [];

  return (
    <section className={medicalCareList}>
      {items.length === 0 ? (
        <p className={empty}>No health care services available yet.</p>
      ) : (
        <div className={grid}>
          {items.map((item) => (
            <Link
              key={item.id}
              className={card}
              href={`/medical-care/${item.id}`}
            >
              <div className={imageBox}>
                {item.thumb_image ? (
                  <Image
                    className={img}
                    src={IMAGE_BASE_URL + item.thumb_image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 962px) 50vw, 33vw"
                  />
                ) : (
                  <span className={placeholder} />
                )}
              </div>
              <div className={titleBox}>
                <h3 className={title}>{item.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default MedicalCareListSection;