import React from 'react';

import { HeroSection, WorkTogether } from '@/shared/components';
import { StorySection } from '@/components/Stories';
import { useFetch } from '@/shared/hook';
import { ICategory } from '@/shared/types/category';

const bgHero =
  'https://res.cloudinary.com/dboyf6lad/image/upload/v1692259174/stories-bg_lo7yuf.png';

const Stories = async () => {
  const storyCategories = await useFetch({ url: '/story-categories' });

  const storyCategoriesData = storyCategories?.data?.map((data: ICategory) => ({
    id: data.id,
    name: data.name,
    banner_image: data.banner_image,
    dataType: 'story',
  }));

  return (
    <>
      <HeroSection
        heroFor="story"
        titleOne="Stories"
        titleTwo="that Inspire"
        backgroundImage={bgHero}
      />
      <StorySection stroyCategories={storyCategoriesData} />
      <WorkTogether />
    </>
  );
};

export default Stories;
