import React from 'react';

import Map from '@/components/Locator/Map/Map';
import OfficeLocations from '@/components/Locator/OfficeLocations/OfficeLocations';
import { WorkTogether } from '@/shared/components';
import { useFetch } from '@/shared/hook';

const LocatorPage = async () => {
  const locators = await useFetch({ url: '/locators' });
  const homePageContentData = await useFetch({ url: '/home-contents' });
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
