// ================= START: src/app/health-packages/page.tsx =================
import React from 'react';

import { HeroSection, WorkTogether } from '@/shared/components';
import { HealthPackages } from '@/components/HealthPackages';
import { HealthPackagesProvider } from '@/shared/context/HealthPackagesContext';
import { getHealthPackagesData } from '@/shared/utils/healthPackagesApi';
import useFetchLaravelData from '@/shared/hook/useFetchData/useFetchData';
import heroImg from '@/assets/images/about/about-bg.webp';

export const metadata = {
  title: 'Health Packages | Grameen Kalyan',
  description:
    'Affordable health checkup packages with doctor consultation for mothers, women, children, chronic patients and senior citizens.',
};

const HealthPackagesPage = async () => {
  const homePageContentData = await useFetchLaravelData({
    url: '/home-contents',
  });
  const workTogetherImage = homePageContentData?.work_together_image;
  const { packages, filters } = await getHealthPackagesData();

  return (
    <>
      <HeroSection
        heroFor="healthcare"
        backgroundImage={heroImg.src}
        imagePosition="center 28%"
        title="Healthcare Packages"
        subtitle="Affordable checkups for you and your family"
      />
      <HealthPackagesProvider packages={packages} filters={filters}>
        <HealthPackages />
      </HealthPackagesProvider>
      <WorkTogether image={workTogetherImage} />
    </>
  );
};

export default HealthPackagesPage;
// ================== END: src/app/health-packages/page.tsx ==================