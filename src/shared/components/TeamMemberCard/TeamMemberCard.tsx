'use client';

import React from 'react';
import Image from 'next/image';

import { ITeamGrid } from '@/shared/types/teanGrid';
import { IMAGE_BASE_URL } from '@/config';

import style from './teamMemberCard.module.scss';

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
  data: ITeamGrid;
  typeOne?: boolean;
  typeTwo?: boolean;
  typeThree?: boolean;
}

const TeamMemberCard = ({
  data,
  typeOne,
  typeTwo,
  typeThree,
}: IBoardMemberCardProps) => {
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
          src={IMAGE_BASE_URL + data.profile_photo}
          alt="member"
          width={500}
          height={500}
        />
      </div>
      <p className={memberName}>{data && data.name}</p>
      <p className={designation}>{data && data.designation}</p>
    </div>
  );
};

export default TeamMemberCard;
