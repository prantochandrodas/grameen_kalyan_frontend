'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { ICheckout, saveCheckout } from '@/shared/utils/checkoutStore';

// Buy Now / Book Now -> always go straight to the Confirm Your Package page.
// Login is handled on that page (no popup).
export const useCheckout = () => {
  const router = useRouter();

  const startCheckout = useCallback(
    (checkout: ICheckout) => {
      saveCheckout(checkout);
      router.push('/confirm-package');
    },
    [router]
  );

  // kept so old code (HealthPackages.tsx / HealthPackageCart.tsx) keeps working
  return { startCheckout, checkoutGate: null, gateOpen: false };
};