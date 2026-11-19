// ================= START: src/data/healthPackages.ts =================
import type { StaticImageData } from 'next/image';

import pregnancyImg from '@/assets/images/services/health-care.webp';
import womenImg from '@/assets/images/healthcare/grid-1.webp';
import diabeticImg from '@/assets/images/services/emergency-response.png';
import hypertensionImg from '@/assets/images/services/healthcare.png';
import childImg from '@/assets/images/services/wellbeing.png';
import infertilityImg from '@/assets/images/about/about-bg.webp';
import seniorImg from '@/assets/images/services/social-business.png';

export type PackageCategory = 'mother' | 'chronic' | 'child' | 'senior';
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
  icon: PackageIconKey;
  image: StaticImageData;
  imagePosition?: string;
  perks: string[];
  tests: IPackageTest[];
  price?: number; // optional manual override of the package price
}

export const PACKAGE_FILTERS: { key: 'all' | PackageCategory; label: string }[] =
  [
    { key: 'all', label: 'All Packages' },
    { key: 'mother', label: 'Mother & Women' },
    { key: 'chronic', label: 'Chronic Care' },
    { key: 'child', label: 'Child Care' },
    { key: 'senior', label: 'Senior Citizen' },
  ];

const t = (name: string, rate: number, price: number = rate): IPackageTest => ({
  name,
  rate,
  price,
});

const CARD_PERKS = [
  'Health Card for up to 6 family members',
  'Doctor consultation included',
];

export const HEALTH_PACKAGES: IHealthPackage[] = [
  {
    id: 'pregnancy',
    name: 'Pregnancy Package',
    tagline: 'Safe motherhood screening',
    category: 'mother',
    icon: 'baby',
    image: pregnancyImg,
    imagePosition: 'center 40%',
    perks: CARD_PERKS,
    tests: [
      t('Card registration', 150),
      t('Blood Grouping', 120, 100),
      t('CBC (cell counter)', 400, 350),
      t('Urine R/E', 200, 150),
      t('FBS', 120, 100),
      t('2HABF', 120, 100),
      t('HBsAg (Screening)', 400, 300),
      t('VDRL', 400, 300),
      t('USG of pregnancy profile (Sonographer Color)', 500, 450),
      t('TSH', 700, 600),
      t('FT4', 1000, 900),
      t('Health center doctor consultation (MBBS)', 250, 200),
    ],
  },
  {
    id: 'women-health',
    name: 'Women Health Package',
    tagline: 'Complete women’s wellness check',
    category: 'mother',
    icon: 'female',
    image: womenImg,
    imagePosition: 'center 45%',
    perks: CARD_PERKS,
    tests: [
      t('Card registration', 150),
      t('CBC (cell counter)', 400, 350),
      t('Urine R/E', 200, 150),
      t('FBS', 120, 100),
      t('2HABF', 120, 100),
      t('Serum Creatinine', 400, 350),
      t('SGPT', 400, 320),
      t('Lipid profile', 1000, 800),
      t('TSH', 700, 600),
      t('FT4', 1000, 900),
      t('USG of W/A', 750, 700),
      t('Health center doctor consultation (MBBS)', 250, 200),
    ],
  },
  {
    id: 'diabetic',
    name: 'Diabetic Package',
    tagline: 'Sugar, kidney & lipid monitoring',
    category: 'chronic',
    icon: 'drop',
    image: diabeticImg,
    imagePosition: 'center 35%',
    perks: CARD_PERKS,
    tests: [
      t('Card registration', 150),
      t('CBC (cell counter)', 400, 350),
      t('Urine R/E', 200, 150),
      t('FBS', 120, 100),
      t('2HABF', 120, 100),
      t('Lipid profile', 1000, 800),
      t('TSH', 700, 600),
      t('FT4', 1000, 900),
      t('USG of whole abdomen', 750, 700),
      t('SGPT', 400, 320),
      t('Serum Creatinine', 400, 350),
      t('Health center doctor consultation (MBBS)', 250, 200),
    ],
  },
  {
    id: 'hypertension',
    name: 'Hypertension Package',
    tagline: 'Heart, kidney & thyroid checkup',
    category: 'chronic',
    icon: 'heart',
    image: hypertensionImg,
    imagePosition: 'center 40%',
    perks: CARD_PERKS,
    tests: [
      t('Card Registration', 150),
      t('CBC (cell counter)', 400, 350),
      t('FBS', 120, 100),
      t('2HABF', 120, 100),
      t('Serum creatinine', 400, 350),
      t('SGPT', 400, 320),
      t('TSH', 700, 600),
      t('FT4', 1000, 900),
      t('USG of whole abdomen', 750, 700),
      t('Health center doctor consultation (MBBS)', 250, 200),
    ],
  },
  {
    id: 'child-care',
    name: 'Child Care Package',
    tagline: 'Essential child health screening',
    category: 'child',
    icon: 'child',
    image: childImg,
    imagePosition: 'center 35%',
    perks: CARD_PERKS,
    tests: [
      t('Card registration', 150),
      t('Blood Grouping', 120, 100),
      t('CBC (cell counter)', 400, 350),
      t('SGPT', 400, 320),
      t('Serum creatinine', 400, 350),
      t('Urine R/E', 200, 150),
      t('HbsAg', 400, 300),
      t('Health center doctor consultation (MBBS)', 250, 200),
    ],
  },
  {
    id: 'infertility',
    name: 'Infertility Special Package',
    tagline: 'Hormone & reproductive screening',
    category: 'mother',
    icon: 'care',
    image: infertilityImg,
    imagePosition: 'center 30%',
    perks: CARD_PERKS,
    tests: [
      t('Card registration', 150),
      t('Blood Grouping', 120, 100),
      t('CBC (cell counter)', 400, 350),
      t('FBS', 120, 100),
      t('2HABF', 120, 100),
      t('Urine R/E', 200, 150),
      t('VDRL', 400, 300),
      t('HbsAg (Screening)', 400, 300),
      t('TSH', 700, 600),
      t('FT4', 1000, 900),
      t('Serum prolactin', 1200, 1000),
      t('USG of L/A (Lower abdomen)', 550, 500),
      t('Health center doctor consultation (MBBS)', 250, 200),
    ],
  },
  {
    id: 'senior-citizen',
    name: 'Senior Citizen (60+) Health Check',
    tagline: 'Complete checkup for 60+ patients',
    category: 'senior',
    icon: 'senior',
    image: seniorImg,
    imagePosition: 'center 40%',
    perks: ['Doctor consultation free', 'Special for age 60+'],
    tests: [
      t('Blood Grouping', 120),
      t('CBC (cell counter)', 400),
      t('Urine R/E', 200),
      t('FBS (Fasting blood sugar)', 120),
      t('2HABF', 120),
      t('S. Creatinine', 400),
      t('SGPT', 400),
      t('Lipid profile', 1000),
      t('TSH', 700),
      t('FT4', 1000),
      t('USG of whole abdomen', 750),
      t('Doctor consultation', 250, 0), // free inside the package
    ],
  },
];

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