import React from 'react';

import { HeroSection, WorkTogether } from '@/shared/components';
import { CareerForm, CulturalPriorities } from '@/components/JoinUs';
import { useFetch } from '@/shared/hook';
import useFetchLaravelData from '@/shared/hook/useFetchData/useFetchData';

// API te banner na thakle ei fallback image dekhabe
const bgImage =
  'https://res.cloudinary.com/dboyf6lad/image/upload/v1692259175/GG0A9660-min_pnnuuc.jpg';

const JoinUs = async () => {
  const bannerData = await useFetchLaravelData({ url: '/banners/join-us' });
  const departmentsData = await useFetch({ url: '/departments' });
  const homePageContentData = await useFetch({ url: '/home-contents' });

  const departments = departmentsData?.data;
  const workTogetherImage = homePageContentData?.work_together_image;

  return (
    <>
      <HeroSection
        heroFor="join-us"
        backgroundImage={bannerData?.data?.banner || bgImage}
        title={bannerData?.data?.title}
        subtitle={bannerData?.data?.subtitle}
      />
      <CulturalPriorities />
      <CareerForm departmentsData={departments} />
      <WorkTogether image={workTogetherImage} />
    </>
  );
};

export default JoinUs;