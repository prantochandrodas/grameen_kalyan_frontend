import React from 'react';

import { StoryListSection } from '@/components/StoryList';
import { HeroSection } from '@/components/Story';
import { useFetch } from '@/shared/hook';
import { WorkTogether } from '@/shared/components';

const heroData = {
  image:
    'https://res.cloudinary.com/dboyf6lad/image/upload/v1692591523/1659420758_3-min_s2cdxp.jpg',
  title: 'More Stories',
};

const StoryList = async () => {
  const stories = await useFetch({ url: '/stories' });
  const homePageContentData = await useFetch({ url: '/home-contents' });
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
