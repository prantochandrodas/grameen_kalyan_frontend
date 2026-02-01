'use client';

import React from 'react';
import Image from 'next/image';

import { IMAGE_BASE_URL } from '@/config';
import { IBoardMember } from '@/shared/types/boardMember';

import style from './boardMemberCard.module.scss';

const {
  boardMemberCard,
  imageContainer,
  img,
  memberName,
  designation,
  cardStyleOne,
  cardStyleTwo,
  cardStyleThree,
} = style;

interface IBoardMemberCardProps {
  data: IBoardMember;
  typeOne?: boolean;
  typeTwo?: boolean;
  typeThree?: boolean;
}

const BoardMemberCard = ({
  data,
  typeOne,
  typeTwo,
  typeThree,
}: IBoardMemberCardProps) => {
  const imgUrl = IMAGE_BASE_URL + data.profile_photo;

  return (
    <div className={boardMemberCard}>
      <div
        className={
          typeOne
            ? `${imageContainer} ${cardStyleOne}`
            : typeTwo
              ? `${imageContainer} ${cardStyleTwo}`
              : typeThree
                ? `${imageContainer} ${cardStyleThree}`
                : `${imageContainer}`
        }
      >
        <Image
          className={img}
          src={imgUrl}
          alt="member"
          width={500}
          height={500}
          priority
        />
      </div>
      <p className={memberName}>{data && data.name}</p>
      <p className={designation}>{data && data.designation}</p>
    </div>
  );
};

export default BoardMemberCard;
