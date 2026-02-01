import React from 'react';
import Link from 'next/link';

import { IStories } from '@/shared/types/stories';
import { ListCard } from '@/shared/components';

import style from './storyListSection.module.scss';
const { storyList, link } = style;

interface IStoryListSectionProps {
  data: IStories[];
}

const StoryListSection = ({ data }: IStoryListSectionProps) => {
  return (
    <div className={storyList}>
      {data?.map((item, index) => (
        <Link
          className={link}
          href={`/stories/${item.id}/${item.id}`}
          key={index}
        >
          <ListCard data={item} />
        </Link>
      ))}
    </div>
  );
};

export default StoryListSection;
