import React from 'react';
import Image from 'next/image';

import { IMAGE_BASE_URL } from '@/config';
import { IBoardMember } from '@/shared/types/boardMember';

import style from './boardMemberCard.module.scss';

const {
  boardMemberCard,
  cardFeatured,
  frame,
  img,
  nameplate,
  memberName,
  designation,
} = style;

interface IBoardMemberCardProps {
  data: IBoardMember;
  /** larger presentation used for the Chairman */
  featured?: boolean;
}

const BoardMemberCard = ({ data, featured }: IBoardMemberCardProps) => {
  const imgUrl = IMAGE_BASE_URL + data.profile_photo;

  return (
    <div
      className={
        featured ? `${boardMemberCard} ${cardFeatured}` : boardMemberCard
      }
    >
      <div className={frame}>
        <Image
          className={img}
          src={imgUrl}
          alt={data.name ? `Portrait of ${data.name}` : 'Board member'}
          width={500}
          height={625}
          sizes="(max-width: 640px) 88vw, (max-width: 1100px) 44vw, 300px"
        />
      </div>
      <div className={nameplate}>
        <h3 className={memberName}>{data.name}</h3>
        <p className={designation}>{data.designation}</p>
      </div>
    </div>
  );
};

export default BoardMemberCard;