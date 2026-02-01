/* eslint-disable indent */
/* eslint-disable implicit-arrow-linebreak */

'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { IMAGE_BASE_URL } from '@/config';

import style from './imageDisplay.module.scss';
import { IImageDisplayProps } from './ImageDisplay.types';
import { filterData } from './imageDisplay.helpers';

const {
  contentContainer,
  heading,
  leftContent,
  content,
  imgContainer,
  imageContainer,
  rightContent,
  img,
  link,
  primaryImageContainer,
  primaryContentContainer,
} = style;

const ImageDisplay = ({ data, primary }: IImageDisplayProps) => {
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [firstImage, setFirstImage] = useState<string>('');
  const [activeFirstImage, setActiveFirstImage] = useState(false);

  // const leftSideData = filterData({ data, from: 1, to: 3 });
  // const rightSideData = filterData({ data, from: 4, to: 6 });
  // eslint-disable-next-line no-unsafe-optional-chaining

  const handleFirstImage = () =>
    data &&
    data?.map(
      (item, index) => index === 0 && setFirstImage(item?.banner_image)
    );
  const handleOnMouseHover = (imgUrl: string) => {
    setActiveFirstImage(false);
    setSelectedImage(imgUrl);
  };

  useEffect(() => {
    handleFirstImage();
    setActiveFirstImage(true);
  }, []);

  return (
    <div
      className={
        primary
          ? `${contentContainer} ${primaryContentContainer}`
          : `${contentContainer}`
      }
    >
      {!primary && <h2 className={heading}>Stories</h2>}
      <div className={leftContent}>
        {data?.slice(0, 3)?.map((data) => (
          <div
            key={data.id}
            className={content}
            onMouseOver={() => handleOnMouseHover(data?.banner_image)}
          >
            <Link
              className={link}
              href={
                data.dataType === 'medical'
                  ? `/medical-care/${data.id}`
                  : data.dataType === 'story'
                    ? `/stories/${data.id}`
                    : '#'
              }
            >
              <p>{data.name}</p>
            </Link>
            <div className={imgContainer}>
              <Image
                className={img}
                src={IMAGE_BASE_URL + data.banner_image}
                alt="stroy image"
                width={500}
                height={500}
                priority
              />
            </div>
          </div>
        ))}
      </div>
      <div
        className={
          primary
            ? `${imageContainer} ${primaryImageContainer}`
            : `${imageContainer}`
        }
      >
        {
          <Image
            className={img}
            src={
              IMAGE_BASE_URL + (activeFirstImage ? firstImage : selectedImage)
            }
            alt=""
            width={1000}
            height={1000}
            priority
          />
        }
      </div>
      <div className={rightContent}>
        {data?.slice(3, 6)?.map((data) => (
          <div
            key={data.id}
            className={content}
            onMouseOver={() => setSelectedImage(data.banner_image)}
          >
            <Link
              className={link}
              href={
                data.dataType === 'medical'
                  ? `/medical-care/${data.id}`
                  : data.dataType === 'story'
                    ? `/stories/${data.id}`
                    : '#'
              }
            >
              <p>{data.name}</p>
            </Link>
            <div className={imgContainer}>
              <Image
                className={img}
                src={IMAGE_BASE_URL + data.banner_image}
                alt="stroy image"
                width={500}
                height={500}
                priority
              />
            </div>
          </div>
        ))}
        <div className={content}>
          <Link
            className={link}
            href={
              data?.[0]?.dataType === 'medical'
                ? '/medical-care-list'
                : data?.[0]?.dataType === 'story'
                  ? '/story-list'
                  : '#'
            }
          >
            {primary ? <p>More Health Care</p> : <p>More Stories</p>}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ImageDisplay;
