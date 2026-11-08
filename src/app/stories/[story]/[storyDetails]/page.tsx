import React from 'react';
import { notFound } from 'next/navigation';

import { DetailSection, CommentSection } from '@/components/StoryDetails';
import { RecentPost, WorkTogether } from '@/shared/components';
import { useFetch } from '@/shared/hook';
import { IStories } from '@/shared/types/stories';
import NewHeroSection from '@/components/StoryDetails/HeroSection/NewHeroSection';

const StoryDetails = async ({
  params,
}: {
  params: { storyDetails: number };
}) => {
    const id = parseInt(params.storyDetails.toString(), 10);

  // independent requests -> fetch in parallel
  const [story, stories, homePageContentData] = await Promise.all([
    useFetch({ url: `/stories?category_id=${id}` }),
    useFetch({ url: '/stories' }),
    useFetch({ url: '/home-contents' }),
  ]);

  if (!story || (!story.title && !story.desc)) notFound();

  const heroSectionData = {
    title: story?.title,
    subtitle: story?.sub_title,
    image: story?.banner_image,
  };
  const detailData = {
    id: story?.id ?? id,
    title: story?.title,
    description: story?.desc,
  };

  // current story must not appear inside "Recent Posts"
  const recentPostData = stories?.data?.filter(
    (data: IStories) => data.id !== id && data.id !== story?.id
  );

  const workTogetherImage = homePageContentData?.work_together_image;
  return (
    <>
      <NewHeroSection data={heroSectionData} />
      {/* <HeroSection data={heroSectionData} /> */}
      <DetailSection data={detailData} />
      <CommentSection storyId={id} />
      <RecentPost data={recentPostData} />
      <WorkTogether image={workTogetherImage} />
    </>
  );
};

export default StoryDetails;
