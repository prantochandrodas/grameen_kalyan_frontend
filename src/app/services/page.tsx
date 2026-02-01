import React from 'react';

import { HeroSection } from '@/shared/components';
import { AreaWeServe, ServiceSection } from '@/components/Services';
import { useFetch } from '@/shared/hook';

const bgHero =
  'https://res.cloudinary.com/dboyf6lad/image/upload/v1692260067/IMG_9405_nw01ee.jpg';

const Services = async () => {
  const services = await useFetch({ url: '/service-contents/services' });

  return (
    <>
      <HeroSection
        titleOne="Serving Bottom of the"
        titleTwo="Pyramid with Utmost"
        titleThree="Care and Sincerity"
        backgroundImage={bgHero}
      />
      <AreaWeServe />
      <ServiceSection servicesData={services?.data} />
    </>
  );
};

export default Services;
