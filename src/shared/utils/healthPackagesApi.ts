import {
  IApiPackage,
  IApiPackageCategory,
  IHealthPackage,
  IPackageFilter,
  buildPackageFilters,
  mapApiPackage,
} from '@/data/healthPackages';
import {
  ICustomTest,
  setCardFeeAmount,
} from '@/shared/utils/healthPackagePricing';

const API_BASE = 'https://admin.grameenkalyan.com/api';

// 12s timeout + 1 retry; returns null only when both tries fail
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getJson = async (path: string, retries = 1): Promise<any> => {
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    try {
      const res = await fetch(`${API_BASE}${path}`, {
        cache: 'no-store',
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });
      if (res.ok) return await res.json();
    } catch {
      // network error or timeout - try again
    } finally {
      clearTimeout(timer);
    }
  }
  return null;
};

/* ================= card-charge / doctor-charge ================= */

export interface IDoctorCharge {
  amount: number;
  status: 1 | 2 | 3; // 1 = added to subtotal, 2 = optional, 3 = free
}

export const fetchCardCharge = async (): Promise<number | null> => {
  const res = await getJson('/card-charge');
  const amount = Number(res?.amount);
  return amount > 0 ? amount : null;
};

export const fetchDoctorCharge = async (): Promise<IDoctorCharge | null> => {
  const res = await getJson('/doctor-charge');
  const status = Number(res?.data?.status);
  if (!res?.data || ![1, 2, 3].includes(status)) return null;
  return {
    amount: Number(res.data.amount) || 0,
    status: status as 1 | 2 | 3,
  };
};

export const getHealthPackagesData = async (): Promise<{
  packages: IHealthPackage[];
  filters: IPackageFilter[];
  failed: boolean;
}> => {
  const [packagesRes, categoriesRes, cardFee] = await Promise.all([
    getJson('/get-packages'),
    getJson('/get-package-categories'),
    fetchCardCharge(),
  ]);
  if (cardFee) setCardFeeAmount(cardFee);

  const apiPackages: IApiPackage[] = Array.isArray(packagesRes?.data)
    ? packagesRes.data
    : [];
  const apiCategories: IApiPackageCategory[] = Array.isArray(
    categoriesRes?.data
  )
    ? categoriesRes.data
    : [];

  return {
    packages: apiPackages.map((p) => mapApiPackage(p, cardFee || undefined)),
    filters: buildPackageFilters(apiCategories),
    failed: !packagesRes,
  };
};


/* ================= Customize package: tests from /api/tests ================= */

interface IApiTest {
  id: number;
  name: string;
  rate: string;
  net_price: string;
  is_active: string | number;
}

// returns null when the API fails (the popup then shows a Retry button)
export const fetchCustomTests = async (): Promise<ICustomTest[] | null> => {
  const res = await getJson('/tests');
  if (!res || !Array.isArray(res.data)) return null;

  return (res.data as IApiTest[])
    .filter(
      (t) => String(t.is_active) === '1' && !/consultation/i.test(t.name)
    )
    .map((t) => ({
      id: t.id,
      key: t.name.trim().toLowerCase().replace(/\s+/g, ' '),
      name: t.name.trim(),
      rate: Number(t.rate) || 0, // regular rate
      price: Number(t.net_price) || 0, // discount rate
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
};