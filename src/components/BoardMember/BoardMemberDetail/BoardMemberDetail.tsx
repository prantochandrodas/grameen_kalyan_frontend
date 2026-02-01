'use client';

import React from 'react';

import style from './boardMemberDetail.module.scss';
import Image from 'next/image';
import { Button } from '@/shared/components';
import { IBoardMember } from '@/shared/types/boardMember';
import { IMAGE_BASE_URL } from '@/config';

const {
  boardMemberDetail,
  imageContainer,
  contentContainer,
  description,
  memberName,
  designation,
  image,
  detailsContainer,
  btnContainer,
} = style;

interface IBoarderMemberDetailProps {
  data: IBoardMember;
}

const BoardMemberDetail = ({ data }: IBoarderMemberDetailProps) => {
  return (
    <div className={boardMemberDetail}>
      <div className={contentContainer}>
        <div className={imageContainer}>
          <Image
            className={image}
            src={IMAGE_BASE_URL + (data && data.profile_photo)}
            alt="member"
            width={100}
            height={100}
            loader={() => IMAGE_BASE_URL + (data && data.profile_photo)}
          />
        </div>
        <div className={detailsContainer}>
          <div
            className={description}
            dangerouslySetInnerHTML={{ __html: data?.desc }}
          ></div>
          <h3 className={memberName}>{data?.name}</h3>
          <p className={designation}>{data?.designation}</p>
        </div>
      </div>
      <div className={btnContainer}>
        <Button text="Back" url="/about" />
      </div>
    </div>
  );
};

export default BoardMemberDetail;
