// ================= START: src/components/HealthPackages/ConfirmPackage.tsx =================
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowRight } from 'react-icons/fa';

import { IHealthPackage } from '@/data/healthPackages';
import { useHealthPackages } from '@/shared/context/HealthPackagesContext';
import { clearCheckout, getCheckout } from '@/shared/utils/checkoutStore';
import type { CardChoice } from '@/shared/utils/healthPackagePricing';
import {
  getHealthPackageCart,
  saveHealthPackageCart,
} from '@/shared/utils/healthPackageCart';

import BookingModal from './BookingModal';
import style from './healthPackages.module.scss';

const ConfirmPackage = () => {
  const router = useRouter();
  const { packages } = useHealthPackages();
  const [ready, setReady] = useState(false);
  const [items, setItems] = useState<IHealthPackage[]>([]);
  const [cardChoice, setCardChoice] = useState<CardChoice | undefined>(undefined);

  useEffect(() => {
    const checkout = getCheckout();
    if (checkout) {
      const list = checkout.ids
        .map((id) => packages.find((pkg) => pkg.id === id))
        .filter((pkg): pkg is IHealthPackage => !!pkg);
      setItems(checkout.custom ? [...list, checkout.custom] : list);
      setCardChoice(checkout.cardChoice);
    }
    setReady(true);
    window.scrollTo(0, 0);
  }, [packages]);

  if (!ready) {
    return (
      <main className={style.pageWrap}>
        <p className={style.pageMsg}>Loading…</p>
      </main>
    );
  }

  if (!items.length) {
    return (
      <main className={style.pageWrap}>
        <div className={style.pageRoot}>
          <div className={`${style.pageSheet} ${style.pageEmpty}`}>
            <h3>No package selected</h3>
            <p>Please choose a healthcare package first.</p>
            <Link href="/health-packages" className={`${style.btn} ${style.btnPrimary}`}>
              Browse packages
              <FaArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={style.pageWrap}>
      <ol className={style.steps} aria-label="Booking steps">
        <li className={style.stepDone}>
          <span>1</span>Select
        </li>
        <li className={style.stepOn}>
          <span>2</span>Confirm
        </li>
        <li>
          <span>3</span>Invoice
        </li>
      </ol>

      <BookingModal
        asPage
        items={items}
        cardChoice={cardChoice}
        onClose={() => router.push('/health-packages')}
        onSuccess={(ids) => {
          clearCheckout();
          try {
            saveHealthPackageCart(
              getHealthPackageCart().filter((id) => !ids.includes(id))
            );
          } catch {
            /* ignore */
          }
        }}
      />
    </main>
  );
};

export default ConfirmPackage;
// ================== END: src/components/HealthPackages/ConfirmPackage.tsx ==================