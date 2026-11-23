// ================= START: src/shared/utils/checkoutStore.ts =================
import type { IHealthPackage } from '@/data/healthPackages';
import type { CardChoice } from '@/shared/utils/healthPackagePricing';

export interface ICheckout {
  ids: string[];
  custom?: IHealthPackage | null;
  cardChoice?: CardChoice;
}

const KEY = 'gk-checkout';

export const saveCheckout = (checkout: ICheckout) => {
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(checkout));
  } catch {
    /* ignore */
  }
};

export const getCheckout = (): ICheckout | null => {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ICheckout) : null;
  } catch {
    return null;
  }
};

export const clearCheckout = () => {
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
};
// ================== END: src/shared/utils/checkoutStore.ts ==================