import React from 'react';

import {
  HeroSection,
  MedicalCareListSection,
} from '@/components/MedicalCareList';
import { WorkTogether } from '@/shared/components';
import { useFetch } from '@/shared/hook';

const heroData = {
  image:
    'https://res.cloudinary.com/dboyf6lad/image/upload/v1692591523/1659420758_3-min_s2cdxp.jpg',
  title: 'More Health Care',
};

const MedicalCareList = async () => {
  const medicalCare = await useFetch({ url: '/disease-specific-medicare' });
  return (
    <>
      <HeroSection data={heroData} />
      <MedicalCareListSection data={medicalCare?.data} />
      <WorkTogether />
    </>
  );
};

export default MedicalCareList;
