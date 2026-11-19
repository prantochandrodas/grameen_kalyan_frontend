import { HEALTH_PACKAGES, IHealthPackage } from '@/data/healthPackages';

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
export const getCardFeeAmount = () => {
  for (let i = 0; i < HEALTH_PACKAGES.length; i += 1) {
    const fee = getCardFee(HEALTH_PACKAGES[i]);
    if (fee) return fee.price;
  }
  return 0;
};