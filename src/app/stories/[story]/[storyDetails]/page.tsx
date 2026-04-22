import React from 'react';

import {
  HeroSection,
  DetailSection,
  CommentSection,
} from '@/components/StoryDetails';
import { RecentPost, WorkTogether } from '@/shared/components';
import { useFetch } from '@/shared/hook';
import { IStories } from '@/shared/types/stories';

const StoryDetails = async ({
  params,
}: {
  params: { storyDetails: number };
}) => {
  const id = parseInt(params.storyDetails.toString());

  const story = await useFetch({ url: `/stories?category_id=${id}` });
  const stories = await useFetch({ url: '/stories' });

  const heroSectionData = {
    title: story?.title,
    subtitle: story?.sub_title,
    image: story?.banner_image,
  };
  const detailData = {
    id: story?.id,
    description: story?.desc,
  };
  const recentPostData = stories?.data?.slice(
    (data: IStories) => data.id === id
  );
  const homePageContentData = await useFetch({ url: '/home-contents' });
  const workTogetherImage = homePageContentData?.work_together_image;
  return (
    <>
      <HeroSection data={heroSectionData} />
      <DetailSection data={detailData} />
      <CommentSection storyId={id} />
      <RecentPost data={recentPostData} />
      <WorkTogether image={workTogetherImage} />
    </>
  );
};

export default StoryDetails;
