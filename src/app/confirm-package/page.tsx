import React from 'react';

import ConfirmPackage from '@/components/HealthPackages/ConfirmPackage';
import { HealthPackagesProvider } from '@/shared/context/HealthPackagesContext';
import { getHealthPackagesData } from '@/shared/utils/healthPackagesApi';

export const metadata = { title: 'Confirm Your Package | Grameen Kalyan' };

const Page = async () => {
  const { packages, filters } = await getHealthPackagesData();

  return (
    <HealthPackagesProvider packages={packages} filters={filters}>
      <ConfirmPackage />
    </HealthPackagesProvider>
  );
};
export default Page;