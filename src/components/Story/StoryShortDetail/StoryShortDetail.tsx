'use client';

import React from 'react';
import Image from 'next/image';

import { Button } from '@/shared/components';
import { IMAGE_BASE_URL } from '@/config';

import { IStoryShortDetailData } from './StoryShortDetail.types';

import style from './storyShortDetail.module.scss';

const {
  storyDetail,
  card,
  imageContainer,
  img,
  divider,
  contentContainer,
  badge,
  heading,
  shortDesc,
  btnContainer,
  btnWrap,
} = style;

interface IStoryShortDetailProps {
  data: IStoryShortDetailData;
}

// admin editor HTML -> clean plain text, so the line clamp always works
const toPlainText = (html = '') => html
  .replace(/<[^>]*>/g, ' ')
  .replace(/&nbsp;/gi, ' ')
  .replace(/&amp;/gi, '&')
  .replace(/&#39;|&rsquo;/gi, "'")
  .replace(/\s+/g, ' ')
  .trim();

const StoryShortDetail = ({ data }: IStoryShortDetailProps) => {
  const imageSrc = data?.image ? IMAGE_BASE_URL + data.image : null;
  const summary = toPlainText(data?.description);

  return (
    <section className={storyDetail}>
      <div className={card}>
        <div className={imageContainer}>
          {imageSrc ? (
            <Image
              className={img}
              src={imageSrc}
              alt={data?.title || 'Story image'}
              fill
              sizes="(max-width: 960px) 100vw, 55vw"
              quality={90}
            />
          ) : null}
        </div>

        <div className={divider} aria-hidden="true" />

        <div className={contentContainer}>
          {/* <span className={badge}>STORY</span> */}
          <h2 className={heading}>{data?.title}</h2>
          {summary ? <p className={shortDesc}>{summary}</p> : null}

          <div className={`${btnContainer} ${btnWrap}`}>
            <Button
              text="Read More →"
              url={`/stories/${data.id}/${data.id}`}
              btnSecondary
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoryShortDetail;
