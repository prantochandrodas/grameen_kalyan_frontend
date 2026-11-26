'use client';

import { useEffect, useState } from 'react';

import {
  IDoctorCharge,
  fetchCardCharge,
  fetchDoctorCharge,
} from '@/shared/utils/healthPackagesApi';
import {
  getCardFeeAmount,
  setCardFeeAmount,
} from '@/shared/utils/healthPackagePricing';

// card fee (/api/card-charge) + doctor charge (/api/doctor-charge)
export const useCharges = () => {
  const [cardFee, setCardFee] = useState<number>(getCardFeeAmount());
  const [doctor, setDoctor] = useState<IDoctorCharge | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let live = true;
    Promise.all([fetchCardCharge(), fetchDoctorCharge()]).then(
      ([card, doc]) => {
        if (!live) return;
        if (card) {
          setCardFeeAmount(card);
          setCardFee(card);
        }
        setDoctor(doc);
        setLoaded(true);
      }
    );
    return () => {
      live = false;
    };
  }, []);

  return { cardFee, doctor, loaded };
};