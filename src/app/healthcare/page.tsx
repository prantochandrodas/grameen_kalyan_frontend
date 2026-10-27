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
import useFetchLaravelData from '@/shared/hook/useFetchData/useFetchData';

const Healthcare = async () => {
  const bannerData = await useFetchLaravelData({ url: '/banners/healthcare' });
  const healthcareService = await useFetch({ url: '/healthcare-services' });
  const medicalCare = await useFetch({ url: '/disease-specific-medicare' });
  const homePageContentData = await useFetch({ url: '/home-contents' });

  const medicalCareCategoryData = medicalCare?.data?.map(
    (data: IMedicalCare) => ({
      id: data.id,
      name: data.title,
      banner_image: data.thumb_image,
      dataType: 'medical',
    })
  );

  const workTogetherImage = homePageContentData?.work_together_image;

  return (
    <>
      <HeroSection
        heroFor="healthcare"
        backgroundImage={bannerData?.data?.banner}
        title={bannerData?.data?.title}
        subtitle={bannerData?.data?.subtitle}
      />
      <HealthcareService servicesData={healthcareService?.data} />
      <MapSection />
      <MedicalCare medicalCareCategory={medicalCareCategoryData} />
      <MedicalCareList medicalCareCategory={medicalCareCategoryData} />
      <WorkTogether image={workTogetherImage} />
    </>
  );
};

export default Healthcare;