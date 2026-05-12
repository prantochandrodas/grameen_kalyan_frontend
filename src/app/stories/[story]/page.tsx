import React from 'react';

import { HeroSection, StoryShortDetail } from '@/components/Story';
import { RecentPost, WorkTogether } from '@/shared/components';
import { useFetch } from '@/shared/hook';
import { IStories } from '@/shared/types/stories';
import useFetchLaravelData from '@/shared/hook/useFetchData/useFetchData';

const Story = async ({ params }: { params: { story: number } }) => {
  const id = parseInt(params.story.toString());

  const story = await useFetch({ url: `/stories?category_id=${id}` });
  const stories = await useFetch({ url: '/stories' });
  const storyCategory = await useFetch({ url: '/story-categories' });

  const matchedCategory = storyCategory?.data?.find(
    (item: any) => item.id === id
  );

  const heroSectionData = {
    title: story?.title,
    image: matchedCategory?.banner_image,
  };
  const storyShortDetail = {
    id: id,
    title: story?.title,
    description: story?.desc,
    image: story?.thumb_image,
  };
  const recentPostData = stories?.data?.slice(
    (data: IStories) => data.id === id
  );
  const homePageContentData = await useFetch({ url: '/home-contents' });
  const workTogetherImage = homePageContentData?.work_together_image;
  return (
    <>
      <HeroSection data={heroSectionData} />
      <StoryShortDetail data={storyShortDetail} />
      <RecentPost data={recentPostData} />
      <WorkTogether image={workTogetherImage} />
    </>
  );
};

export default Story;
