import React from 'react';

import { HeroSection, WorkTogether } from '@/shared/components';
import { StorySection } from '@/components/Stories';
import { useFetch } from '@/shared/hook';
import { ICategory } from '@/shared/types/category';
import useFetchLaravelData from '@/shared/hook/useFetchData/useFetchData';

// API te banner na thakle ei fallback image dekhabe
const bgHero =
  'https://res.cloudinary.com/dboyf6lad/image/upload/v1692259174/stories-bg_lo7yuf.png';

const Stories = async () => {
  const bannerData = await useFetchLaravelData({ url: '/banners/stories' });
  const storyCategories = await useFetch({ url: '/story-categories' });
  const homePageContentData = await useFetch({ url: '/home-contents' });

  const storyCategoriesData = storyCategories?.data?.map((data: ICategory) => ({
    id: data.id,
    name: data.name,
    banner_image: data.banner_image,
    dataType: 'story',
  }));

  const workTogetherImage = homePageContentData?.work_together_image;

  return (
    <>
      <HeroSection
        heroFor="story"
        titleOne="Stories"
        titleTwo="that Inspire"
        backgroundImage={bannerData?.data?.banner || bgHero}
        title={bannerData?.data?.title}
        subtitle={bannerData?.data?.subtitle}
      />
      <StorySection stroyCategories={storyCategoriesData} />
      <WorkTogether image={workTogetherImage} />
    </>
  );
};

export default Stories;