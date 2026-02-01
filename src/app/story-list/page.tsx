import React from 'react';

import { HeroSection, StoryListSection } from '@/components/StoryList';
import { useFetch } from '@/shared/hook';
import { WorkTogether } from '@/shared/components';

const heroData = {
  image:
    'https://res.cloudinary.com/dboyf6lad/image/upload/v1692591523/1659420758_3-min_s2cdxp.jpg',
  title: 'More stories',
};

const StoryList = async () => {
  const stories = await useFetch({ url: '/stories' });
  return (
    <>
      <HeroSection data={heroData} />
      <StoryListSection data={stories.data} />
      <WorkTogether />
    </>
  );
};

export default StoryList;
