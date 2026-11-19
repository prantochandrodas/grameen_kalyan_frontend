import React from 'react';

import Map from '@/components/Locator/Map/Map';
import OfficeLocations from '@/components/Locator/OfficeLocations/OfficeLocations';
import { WorkTogether } from '@/shared/components';

import useFetchLaravelData from '@/shared/hook/useFetchData/useFetchData';
const LocatorPage = async () => {
  const locators = await useFetchLaravelData({ url: '/locators' });
  const homePageContentData = await useFetchLaravelData({ url: '/home-contents' });
  const workTogetherImage = homePageContentData?.work_together_image;
  return (
    <>
      <Map />
      <OfficeLocations officeLocationsData={locators?.data} />
      <WorkTogether image={workTogetherImage} />
    </>
  );
};

export default LocatorPage;
