import React from 'react';

import { useFetch } from '@/shared/hook';

import { HeroSection, DetailSection } from '@/components/ServiceDetail';
import useFetchLaravelData from '@/shared/hook/useFetchData/useFetchData';

/* always read fresh data from the API (no stale banner_images) */
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const ServiceDetails = async ({ params }: { params: { service: number } }) => {
  const decodeParams = parseInt(params.service.toString());

  const service = await useFetchLaravelData({
    url: `/service-contents/details?id=${decodeParams}`,
  });
  const hasBannerImages =
    Array.isArray(service?.banner_images) &&
    service.banner_images.some(
      (img: unknown) => typeof img === 'string' && img.trim() !== ''
    );

  const heroSectionData = {
    heroTitle: service?.service_detail_slogan,
    heroSubTitle: service?.service_detail_sub_title,
    /* default image is passed ONLY when banner_images is empty */
    heroImage: hasBannerImages ? undefined : service?.service_detail_banner_image,
    bannerImages: hasBannerImages ? service.banner_images : [],
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
