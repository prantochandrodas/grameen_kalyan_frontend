import React from 'react';

import { useFetch } from '@/shared/hook';

import { HeroSection, DetailSection } from '@/components/ServiceDetail';

const ServiceDetails = async ({ params }: { params: { service: number } }) => {
  const decodeParams = parseInt(params.service.toString());

  const service = await useFetch({
    url: `/service-contents/details?id=${decodeParams}`,
  });

  const heroSectionData = {
    heroTitle: service?.service_detail_slogan,
    heroImage: service?.service_detail_banner_image,
  };
  const serviceDescription = service?.long_description;

  return (
    <>
      <HeroSection data={heroSectionData} />
      <DetailSection detail={serviceDescription} />
    </>
  );
};

export default ServiceDetails;
