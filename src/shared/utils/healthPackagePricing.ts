import { HEALTH_CARD_FEE, IHealthPackage } from '@/data/healthPackages';

export const CARD_VALIDITY_MONTHS = 6;

const CARD_REGEX = /card\s*registration/i;
export const isCardFee = (name: string) => CARD_REGEX.test(name);

// price of the package WITHOUT the card registration line
export const getPackageCore = (pkg: IHealthPackage) => {
  const tests = pkg.tests.filter((t) => !isCardFee(t.name));
  const rate = tests.reduce((sum, t) => sum + t.rate, 0);
  const price = tests.reduce((sum, t) => sum + t.price, 0);
  const save = rate - price;
  const percent = rate > 0 ? Math.round((save / rate) * 100) : 0;
  return { tests, rate, price, save, percent, testCount: tests.length };
};

// the card registration line of a package (null if the package has none)
export const getCardFee = (pkg: IHealthPackage) => {
  const card = pkg.tests.find((t) => isCardFee(t.name));
  return card ? { rate: card.rate, price: card.price } : null;
};

// the card fee is charged ONCE for the whole cart
export const getCartTotals = (items: IHealthPackage[]) => {
  const cores = items.map(getPackageCore);
  const fees = items.map(getCardFee).filter(Boolean) as {
    rate: number;
    price: number;
  }[];

  const packagesRate = cores.reduce((sum, c) => sum + c.rate, 0);
  const packagesPrice = cores.reduce((sum, c) => sum + c.price, 0);
  const cardFee = fees.length ? Math.max(...fees.map((f) => f.price)) : 0;

  return {
    count: items.length,
    packagesRate,
    packagesPrice,
    cardFee,
    totalRate: packagesRate + cardFee,
    total: packagesPrice + cardFee,
    saved: packagesRate - packagesPrice,
    testCount: cores.reduce((sum, c) => sum + c.testCount, 0),
  };
};

// card fee amount for the page notice
export const getCardFeeAmount = () => HEALTH_CARD_FEE;


/* ================= Customize package ================= */

export type CustomerMode = 'member' | 'regular';

// answer taken inside the Customize Package popup
// member = existing member (discount rate, no card fee)
// yes    = new user / expired card takes the Health Card (discount rate + card fee)
// no     = new user / expired card, no card (regular rate, no card fee)
export type CardChoice = 'member' | 'yes' | 'no';

// the doctor consultation test (offered when Book Now is clicked)
export const CUSTOM_CONSULT_KEY = 'health center doctor consultation (mbbs)';

export interface ICustomTest {
  key: string;
  name: string;
  rate: number; // regular rate
  price: number; // discount rate
}

export const CUSTOM_PACKAGE_ID = 'custom-package';

// same test with a different spelling in different packages -> one test
const TEST_ALIASES: Record<string, string> = {
  's. creatinine': 'serum creatinine',
  'fbs (fasting blood sugar)': 'fbs',
  hbsag: 'hbsag (screening)',
  'doctor consultation': 'health center doctor consultation (mbbs)',
};

// every unique test from all packages (card registration excluded), A-Z
export const getCustomTests = (packages: IHealthPackage[]): ICustomTest[] => {
  const map = new Map<string, ICustomTest>();

  packages.forEach((pkg) => {
    pkg.tests.forEach((t) => {
      if (isCardFee(t.name)) return;
      const base = t.name.trim().toLowerCase().replace(/\s+/g, ' ');
      const key = TEST_ALIASES[base] || base;
      const found = map.get(key);

      if (!found) {
        map.set(key, {
          key,
          name: t.name.trim(),
          rate: t.rate,
          price: t.price,
        });
      } else if (found.price === 0 && t.price > 0) {
        // a "FREE" copy of a test must not win over the paid one
        found.rate = t.rate;
        found.price = t.price;
      }
    });
  });

  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
};

// turns the selected tests into a normal package, so cart/booking/invoice logic works as it is
// Always keeps BOTH rates (rate = regular, price = discount).
// The Confirm Your Package page decides which one is charged (card Yes/No).
export const buildCustomPackage = (
  selected: ICustomTest[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _mode?: CustomerMode
): IHealthPackage => {
  const tests = selected.map((t) => ({
    name: t.name,
    rate: t.rate,
    price: t.price,
  }));

  return {
    id: CUSTOM_PACKAGE_ID,
    name: 'Customized Package',
    tagline: 'Tests chosen by you',
    category: 'custom',
    icon: 'care',
    image: '',
    perks: [],
    tests: tests as IHealthPackage['tests'],
  };
};