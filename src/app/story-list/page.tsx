import React from 'react';

import { StoryListSection } from '@/components/StoryList';
import { HeroSection } from '@/components/Story';
import { WorkTogether } from '@/shared/components';
import useFetchLaravelData from '@/shared/hook/useFetchData/useFetchData';

const heroData = {
  image:
    'https://res.cloudinary.com/dboyf6lad/image/upload/v1692591523/1659420758_3-min_s2cdxp.jpg',
  title: 'More Stories',
};

const StoryList = async () => {
  const stories = await useFetchLaravelData({ url: '/stories' });
  const homePageContentData = await useFetchLaravelData({ url: '/home-contents' });
  const workTogetherImage = homePageContentData?.work_together_image;
  return (
    <>
      <HeroSection data={heroData} />
      <StoryListSection data={stories?.data} />
      <WorkTogether image={workTogetherImage} />
    </>
  );
};

export default StoryList;
