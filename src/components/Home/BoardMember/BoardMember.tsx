import React from 'react';
import Image from 'next/image';

import layoutTR from '@/assets/layout/layout-tr-large.svg';
import layoutBL from '@/assets/layout/home/GK_website_OPT_01-04.svg';

import { BoardMemberCard } from '../BoardMemberCard';
import style from './boardMember.module.scss';

const { boardMember, layoutRight, layoutLeft, img, memberCardContainer } =
  style;

interface IBoardMemberProps {
  memberData: {
    id: number;
    name: string;
    description: string;
    designation: string;
    image: string;
    reverse: boolean;
  }[];
}

const BoardMember = ({ memberData }: IBoardMemberProps) => {
  return (
    <div className={boardMember}>
      <div className={layoutRight}>
        <Image className={img} src={layoutTR} alt="layout" />
      </div>
      <div className={layoutLeft}>
        <Image className={img} src={layoutBL} alt="layout" />
      </div>
      {memberData.map((data) => (
        <div className={memberCardContainer} key={data.id}>
          <BoardMemberCard memberData={data} />
        </div>
      ))}
    </div>
  );
};

export default BoardMember;
