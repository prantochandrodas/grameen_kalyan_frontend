import React from 'react';

import { HeroSection, NewsletterSection } from '@/components/Newsletter';
import { WorkTogether } from '@/shared/components';
import useFetchLaravelData from '@/shared/hook/useFetchData/useFetchData';

const heroData = {
  image:
    'https://res.cloudinary.com/dboyf6lad/image/upload/v1693724184/IMG_9582_q2mf8c.jpg',
  title: 'Newsletters',
};

const Newsletter = async () => {
  const newsletters = await useFetchLaravelData({ url: '/newsletter' });
  const homePageContentData = await useFetchLaravelData({ url: '/home-contents' });
  const workTogetherImage = homePageContentData?.work_together_image;
  return (
    <>
      <HeroSection data={heroData} />
      <NewsletterSection data={newsletters.data} />
      <WorkTogether image={workTogetherImage} />
    </>
  );
};

export default Newsletter;
