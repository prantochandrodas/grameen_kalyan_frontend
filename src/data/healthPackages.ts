// ================= START: src/data/healthPackages.ts =================
import type { StaticImageData } from 'next/image';

export type PackageCategory = string; // category id (API)
export type PackageIconKey =
  | 'baby'
  | 'female'
  | 'drop'
  | 'heart'
  | 'child'
  | 'care'
  | 'senior';

export interface IPackageTest {
  name: string;
  rate: number; // normal rate
  price: number; // package price (0 = free)
}

export interface IHealthPackage {
  id: string;
  name: string;
  tagline: string;
  category: PackageCategory;
  categoryName?: string;
  icon: PackageIconKey;
  image: StaticImageData | string;
  imagePosition?: string;
  perks: string[];
  tests: IPackageTest[];
  price?: number; // optional manual override of the package price
}

export interface IPackageFilter {
  key: string; // 'all' or category id
  label: string;
}

/* ================= API: get-packages / get-package-categories ================= */

export interface IApiPackageTest {
  test_id: string;
  name: string;
  rate: number;
  net_price: number;
}

export interface IApiPackage {
  id: number;
  name: string;
  category_id: string;
  category_name: string;
  description: string | null;
  thumbnail_image: string | null;
  doctor_charge: number;
  final_doctor_charge: number;
  tests: IApiPackageTest[];
}

export interface IApiPackageCategory {
  id: number;
  name: string;
}

// one-time Health Card fee (API te nei)
export const HEALTH_CARD_FEE = 150;

const CONSULT_NAME = 'Health center doctor consultation (MBBS)';

// card icon: package er nam dekhe (API te icon nei)
const ICON_RULES: [RegExp, PackageIconKey][] = [
  [/pregnan/i, 'baby'],
  [/women/i, 'female'],
  [/diabet/i, 'drop'],
  [/hyper/i, 'heart'],
  [/child/i, 'child'],
  [/senior/i, 'senior'],
];

const getIcon = (name: string): PackageIconKey => {
  const rule = ICON_RULES.find(([re]) => re.test(name));
  return rule ? rule[1] : 'care';
};

export const buildPackageFilters = (
  categories: IApiPackageCategory[]
): IPackageFilter[] => [
  { key: 'all', label: 'All Packages' },
  ...categories.map((c) => ({ key: String(c.id), label: c.name })),
];

export const mapApiPackage = (p: IApiPackage): IHealthPackage => {
  const tests: IPackageTest[] = (p.tests || []).map((item) => ({
    name: item.name,
    rate: Number(item.rate) || 0,
    price: Number(item.net_price) || 0,
  }));

  // doctor consultation API te alada field; list a na thakle shesh a add hobe
  if (
    Number(p.doctor_charge) > 0 &&
    !tests.some((item) => /consultation/i.test(item.name))
  ) {
    tests.push({
      name: CONSULT_NAME,
      rate: Number(p.doctor_charge),
      price: Number(p.final_doctor_charge) || 0,
    });
  }

  return {
    id: String(p.id),
    name: p.name,
    tagline: (p.description || '').replace(/\s+/g, ' ').trim(),
    category: String(p.category_id),
    categoryName: p.category_name,
    icon: getIcon(p.name),
    image: p.thumbnail_image || '',
    perks: [],
    tests: [
      { name: 'Card registration', rate: HEALTH_CARD_FEE, price: HEALTH_CARD_FEE },
      ...tests,
    ],
  };
};
export const formatBDT = (amount: number) =>
  `BDT ${amount.toLocaleString('en-US')}`;

export const getPackageTotals = (pkg: IHealthPackage) => {
  const rate = pkg.tests.reduce((sum, item) => sum + item.rate, 0);
  const price =
    pkg.price ?? pkg.tests.reduce((sum, item) => sum + item.price, 0);
  const save = Math.max(rate - price, 0);
  const percent = rate ? Math.round((save / rate) * 100) : 0;
  const testCount = pkg.tests.filter(
    (item) => !/registration|consultation/i.test(item.name)
  ).length;

  return { rate, price, save, percent, testCount };
};
// ================== END: src/data/healthPackages.ts ==================