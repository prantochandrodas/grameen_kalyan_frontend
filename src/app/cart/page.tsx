import React from 'react';

import HealthPackageCart from '@/components/HealthPackages/HealthPackageCart';
import { HealthPackagesProvider } from '@/shared/context/HealthPackagesContext';
import { getHealthPackagesData } from '@/shared/utils/healthPackagesApi';

export const metadata = {
  title: 'Your Cart | Grameen Kalyan',
  description: 'Review and book your selected Grameen Kalyan health packages.',
};

const CartPage = async () => {
  const { packages, filters } = await getHealthPackagesData();

  return (
    <HealthPackagesProvider packages={packages} filters={filters}>
      <HealthPackageCart />
    </HealthPackagesProvider>
  );
};

export default CartPage;
