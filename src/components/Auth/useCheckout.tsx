// ================= START: src/components/Auth/useCheckout.tsx =================
'use client';

import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';

import { getSessionUser } from '@/shared/utils/authService';
import { ICheckout, saveCheckout } from '@/shared/utils/checkoutStore';

import AuthGateModal from './AuthGateModal';

// Buy Now / Book Now / Continue to booking -> login user goes straight to the
// Confirm Your Package page, a visitor first sees the existing/new popup.
export const useCheckout = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const startCheckout = useCallback(
    (checkout: ICheckout) => {
      saveCheckout(checkout);
      if (getSessionUser()) router.push('/confirm-package');
      else setOpen(true);
    },
    [router]
  );

  const checkoutGate = (
    <AnimatePresence>
      {open && (
        <AuthGateModal
          key="gate"
          onClose={() => setOpen(false)}
          onContinue={() => {
            setOpen(false);
            router.push('/confirm-package');
          }}
        />
      )}
    </AnimatePresence>
  );

  return { startCheckout, checkoutGate, gateOpen: open };
};
// ================== END: src/components/Auth/useCheckout.tsx ==================