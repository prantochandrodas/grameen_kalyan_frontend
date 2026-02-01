import React from 'react';

import { HeroSection, NewsletterSection } from '@/components/Newsletter';
import { WorkTogether } from '@/shared/components';
import { useFetch } from '@/shared/hook';

const heroData = {
  image:
    'https://res.cloudinary.com/dboyf6lad/image/upload/v1693724184/IMG_9582_q2mf8c.jpg',
  title: 'Newsletters',
};

const Newsletter = async () => {
  const newsletters = await useFetch({ url: '/newsletter' });

  return (
    <>
      <HeroSection data={heroData} />
      <NewsletterSection data={newsletters.data} />
      <WorkTogether />
    </>
  );
};

export default Newsletter;
