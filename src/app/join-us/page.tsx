import React from 'react';

import { HeroSection, WorkTogether } from '@/shared/components';
import { CareerForm, CulturalPriorities } from '@/components/JoinUs';
import { useFetch } from '@/shared/hook';

const JoinUs = async () => {
  const bgImage =
    'https://res.cloudinary.com/dboyf6lad/image/upload/v1692259175/GG0A9660-min_pnnuuc.jpg';

  const departmentsData = await useFetch({ url: '/departments' });
  const departments = departmentsData?.data;
  const homePageContentData = await useFetch({ url: '/home-contents' });
  const workTogetherImage = homePageContentData?.work_together_image;
  return (
    <>
      <HeroSection heroFor="join-us" backgroundImage={bgImage} />
      <CulturalPriorities />
      <CareerForm departmentsData={departments} />
      <WorkTogether image={workTogetherImage ?? ''} />
    </>
  );
};

export default JoinUs;
