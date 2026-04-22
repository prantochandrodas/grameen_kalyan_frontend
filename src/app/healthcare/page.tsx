'use client';

import React from 'react';

import { HeroSection, WorkTogether } from '@/shared/components';
import {
  HealthcareService,
  MapSection,
  MedicalCare,
  MedicalCareList,
} from '@/components/Healthcare';
import { useFetch } from '@/shared/hook';
import { IMedicalCare } from '@/shared/types/medicalCare';

const Healthcare = async () => {
  const healthcareService = await useFetch({ url: '/healthcare-services' });
  const medicalCare = await useFetch({ url: '/disease-specific-medicare' });

  const medicalCareCategoryData = medicalCare?.data?.map(
    (data: IMedicalCare) => ({
      id: data.id,
      name: data.title,
      banner_image: data.thumb_image,
      dataType: 'medical',
    })
  );

  const bgHero =
    'https://res.cloudinary.com/dboyf6lad/image/upload/v1692259176/healthcare-bg_lgc2rn.png';
  const homePageContentData = await useFetch({ url: '/home-contents' });
  const workTogetherImage = homePageContentData?.work_together_image;
  return (
    <>
      <HeroSection heroFor="healthcare" backgroundImage={bgHero} />
      <HealthcareService servicesData={healthcareService?.data} />
      <MapSection />
      <MedicalCare />
      <MedicalCareList medicalCareCategory={medicalCareCategoryData} />
      <WorkTogether image={workTogetherImage} />
    </>
  );
};

export default Healthcare;
