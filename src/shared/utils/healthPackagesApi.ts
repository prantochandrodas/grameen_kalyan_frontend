import { LARAVEL_BASE_URL } from '@/config';
import {
  IApiPackage,
  IApiPackageCategory,
  IHealthPackage,
  IPackageFilter,
  buildPackageFilters,
  mapApiPackage,
} from '@/data/healthPackages';

const getJson = async (path: string) => {
  try {
    const res = await fetch(`${LARAVEL_BASE_URL}${path}`, {
      cache: 'no-store',
    });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
};

export const getHealthPackagesData = async (): Promise<{
  packages: IHealthPackage[];
  filters: IPackageFilter[];
}> => {
  const [packagesRes, categoriesRes] = await Promise.all([
    getJson('/get-packages'),
    getJson('/get-package-categories'),
  ]);

  const apiPackages: IApiPackage[] = Array.isArray(packagesRes?.data)
    ? packagesRes.data
    : [];
  const apiCategories: IApiPackageCategory[] = Array.isArray(
    categoriesRes?.data
  )
    ? categoriesRes.data
    : [];

  return {
    packages: apiPackages.map(mapApiPackage),
    filters: buildPackageFilters(apiCategories),
  };
};