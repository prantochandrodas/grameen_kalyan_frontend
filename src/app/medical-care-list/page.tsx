import React from 'react';

import { MedicalCareListSection } from '@/components/MedicalCareList';
import { HeroSection } from '@/components/Story';
import { WorkTogether } from '@/shared/components';
import useFetchLaravelData from '@/shared/hook/useFetchData/useFetchData';

const heroData = {
  image:
    'https://res.cloudinary.com/dboyf6lad/image/upload/v1692591523/1659420758_3-min_s2cdxp.jpg',
  title: 'More Health Care',
};

const MedicalCareList = async () => {
  const medicalCare = await useFetchLaravelData({ url: '/disease-specific-medicare' });
  const homePageContentData = await useFetchLaravelData({ url: '/home-contents' });
  const workTogetherImage = homePageContentData?.work_together_image;
  return (
    <>
      <HeroSection data={heroData} />
      <MedicalCareListSection data={medicalCare?.data} />
      <WorkTogether image={workTogetherImage} />
    </>
  );
};

export default MedicalCareList;
