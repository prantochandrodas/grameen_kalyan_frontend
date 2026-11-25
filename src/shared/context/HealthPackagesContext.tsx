'use client';

import React, { createContext, useContext, useMemo } from 'react';

import type { IHealthPackage, IPackageFilter } from '@/data/healthPackages';

interface IHealthPackagesValue {
  packages: IHealthPackage[];
  filters: IPackageFilter[];
}

const HealthPackagesContext = createContext<IHealthPackagesValue>({
  packages: [],
  filters: [],
});

export const HealthPackagesProvider = ({
  packages,
  filters,
  children,
}: IHealthPackagesValue & { children: React.ReactNode }) => {
  const value = useMemo(() => ({ packages, filters }), [packages, filters]);
  return (
    <HealthPackagesContext.Provider value={value}>
      {children}
    </HealthPackagesContext.Provider>
  );
};

export const useHealthPackages = () => useContext(HealthPackagesContext);