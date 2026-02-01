/* eslint-disable comma-dangle */
import React from 'react';

import { useFetch } from '@/shared/hook';

import {
  HeroSection,
  DetailSection,
} from '@/components/HealthcareServiceDetail';
import { IHealthcareService } from '@/shared/types/healthcareService';

const ServiceDetails = async ({
  params,
}: {
  params: { healthcareService: number };
}) => {
  const id = parseInt(params.healthcareService.toString());

  const services = await useFetch({ url: '/healthcare-services' });

  const detailData = services?.data?.find(
    (data: IHealthcareService) => data.id === id
  );

  const heroSectionData = {
    title: detailData?.title,
    SubTitle: detailData?.sub_title,
    image: detailData?.banner_image,
  };
  const serviceDescription = detailData?.description;

  return (
    <>
      <HeroSection data={heroSectionData} />
      <DetailSection detail={serviceDescription} />
    </>
  );
};

export default ServiceDetails;
