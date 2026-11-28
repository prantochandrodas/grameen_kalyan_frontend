'use client';

import { useEffect, useMemo, useState } from 'react';

export interface IHealthPackageContent {
  banner_image: string;
  banner_title: string;
  banner_subtitle: string;
  heading: string;
  title_one: string;
  title_two: string;
  description: string;
  feature_one: string;
  feature_two: string;
  feature_three: string;
  health_card_title: string;
  health_card_description: string;
  custom_package_title: string;
  custom_package_description: string;
  custom_package_button_text: string;
}

const API_URL = 'https://admin.grameenkalyan.com/api/health-package-content';

// shown instantly (and used if the API fails) - same text as the current design
export const DEFAULT_HEALTH_PACKAGE_CONTENT: IHealthPackageContent = {
  banner_image: '',
  banner_title: 'Healthcare Packages',
  banner_subtitle: 'Affordable checkups for you and your family',
  heading: 'Affordable Checkups for your loved ones',
  title_one: 'Our Healthcare',
  title_two: 'Packages',
  description:
    'Choose a package made for you and your family. Quality diagnostic tests and doctor consultation at special discounted prices.',
  feature_one: 'Healthcare Card for up to 6 family members',
  feature_two: 'Doctor consultation with every package',
  feature_three: 'Special discounted diagnostic rates',
  health_card_title: '', // empty = component keeps its own fallback
  health_card_description: '',
  custom_package_title: 'Can’t find the right package?',
  custom_package_description:
    'Pick only the tests you need and build your own package.',
  custom_package_button_text: 'Customize Package',
};

let cached: IHealthPackageContent | null = null;
let pending: Promise<IHealthPackageContent> | null = null;

const clean = (value: unknown) =>
  typeof value === 'string' ? value.trim() : '';

// empty / missing API fields fall back to the default text
const normalize = (raw: any): IHealthPackageContent => {
  const result = { ...DEFAULT_HEALTH_PACKAGE_CONTENT };
  (Object.keys(result) as (keyof IHealthPackageContent)[]).forEach((key) => {
    const value = clean(raw?.[key]);
    if (value) result[key] = value;
  });
  return result;
};

export const getHealthPackageContent =
  async (): Promise<IHealthPackageContent> => {
    if (cached) return cached;
    if (!pending) {
      pending = (async () => {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 10000);
        try {
          const res = await fetch(API_URL, {
            headers: { Accept: 'application/json' },
            signal: controller.signal,
          });
          if (!res.ok) throw new Error('bad status');
          const json = await res.json();
          if (!json?.success || !json?.data) throw new Error('bad data');
          cached = normalize(json.data);
          return cached;
        } catch (e) {
          return DEFAULT_HEALTH_PACKAGE_CONTENT; // not cached, retries next visit
        } finally {
          clearTimeout(timer);
          pending = null;
        }
      })();
    }
    return pending;
  };

// initial = content already fetched on the server (page.tsx) -> no default-text flash
export const useHealthPackageContent = (
  initial?: Partial<IHealthPackageContent> | null
): IHealthPackageContent => {
  const [fetched, setFetched] = useState<IHealthPackageContent>(
    cached || DEFAULT_HEALTH_PACKAGE_CONTENT
  );

  useEffect(() => {
    if (initial) return undefined; // server data is already fresh
    let alive = true;
    getHealthPackageContent().then((data) => {
      if (alive) setFetched(data);
    });
    return () => {
      alive = false;
    };
  }, [initial]);

  return useMemo(() => (initial ? normalize(initial) : fetched), [initial, fetched]);
};