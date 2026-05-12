'use client';

import React from 'react';
import Image from 'next/image';

import { Button } from '@/shared/components';
import { IStoryShortDetailData } from './StoryShortDetail.types';
import { IMAGE_BASE_URL } from '@/config';

import style from './storyShortDetail.module.scss';

const {
  storyDetail,
  imageContainer,
  img,
  divider,
  lineOne,
  lineTwo,
  box,
  contentContainer,
  heading,
  shortDesc,
  btnContainer,
} = style;

interface IStoryShortDetailProps {
  data: IStoryShortDetailData;
}

const StoryShortDetail = ({ data }: IStoryShortDetailProps) => {
  console.log(data);
  return (
    <div className={storyDetail}>
      <div className={imageContainer}>
        <Image
          className={img}
          src={IMAGE_BASE_URL + data.image}
          alt="img"
          width={1000}
          height={1000}
        />
      </div>
      <div className={divider}>
        <div className={lineOne} />
        <div className={box} />
        <div className={lineTwo} />
      </div>
      <div className={contentContainer}>
        <h2 className={heading}>{data.title}</h2>
        <div className={shortDesc}
          dangerouslySetInnerHTML={{ __html: data.description }}
        ></div>

        <div className={btnContainer}>
          <Button
            text="Read More"
            url={`/stories/${data.id}/${data.id}`}
            btnSecondary
          />
        </div>
      </div>
    </div>
  );
};

export default StoryShortDetail;
