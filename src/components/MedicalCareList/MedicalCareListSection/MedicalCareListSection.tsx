import React from 'react';
import Link from 'next/link';

import { IStories } from '@/shared/types/stories';
import { ListCard } from '@/shared/components';

import style from './medicalCareListSection.module.scss';
const { medicalCareList, link } = style;

interface IStoryListSectionProps {
  data: IStories[];
}

const MedicalCareListSection = ({ data }: IStoryListSectionProps) => {
  return (
    <div className={medicalCareList}>
      {data?.map((item, index) => (
        <Link className={link} href={`/medical-care/${item.id}`} key={index}>
          <ListCard data={item} />
        </Link>
      ))}
    </div>
  );
};

export default MedicalCareListSection;
