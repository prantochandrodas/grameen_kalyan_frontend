import React from 'react';
import '../style/globals.scss';
// import { Inter } from 'next/font/google';

import {
  Navbar,
  Footer,
  SidebarSticky,
  ButtonScrollTop,
} from '@/shared/components';
import OpeningPopup from '@/shared/components/OpeningPopup/OpeningPopup';
import EagerImages from '@/shared/components/EagerImages/EagerImages';
import { AuthProvider } from '@/shared/context/AuthContext';
import { SettingProvider } from '@/shared/context/SettingContext';
import useFetchLaravelData from '@/shared/hook/useFetchData/useFetchData';

// const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata() {
  const settingRes = await useFetchLaravelData({
    url: '/setting',
    revalidateIn: 3600,
  });
  const setting = settingRes?.data ?? {};

  return {
    title: setting.company_name || 'Grameen Kalyan',
    description:
      'Grameen Kalyan believes in trust, quality and innovation in delivering services. We are on a mission to transform healthcare in Bangladesh at primary, ...',
    icons: setting.fav_icon ? { icon: setting.fav_icon } : undefined,
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [navbarData, servicesRes, donatesRes, settingRes, popupRes] = await Promise.all([
    useFetchLaravelData({ url: '/home-contents', revalidateIn: 86400 }),
    useFetchLaravelData({ url: '/service-contents/services', revalidateIn: 86400 }),
    useFetchLaravelData({ url: '/donates', revalidateIn: 3600 }),
    useFetchLaravelData({ url: '/setting', revalidateIn: 3600 }),
    useFetchLaravelData({ url: '/popup-images', revalidateIn: 300 }),
  ]);

  const services = Array.isArray(servicesRes)
    ? servicesRes
    : (servicesRes?.data ?? []);

  const donates = Array.isArray(donatesRes)
    ? donatesRes
    : (donatesRes?.data ?? []);

  const setting = settingRes?.data ?? {};

  const popupItems = (Array.isArray(popupRes?.data) ? popupRes.data : [])
    .filter((item: { image?: string }) => Boolean(item?.image))
    .sort(
      (a: { serial_no?: string | number }, b: { serial_no?: string | number }) =>
        Number(a.serial_no ?? 0) - Number(b.serial_no ?? 0)
    )
    .map((item: { id: number; image: string }) => ({
      id: item.id,
      image: item.image,
    }));

  const badgeImage = navbarData?.badge_image;
  const logoImage = navbarData?.navbar_logo;

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <SettingProvider value={setting}>
          <AuthProvider>
            <Navbar
              badgeImage={badgeImage}
              logoImage={logoImage}
              donates={donates}
              services={services}
            />
            {children}
            <SidebarSticky />
            <Footer logoImage={logoImage} />
            <ButtonScrollTop />
            <OpeningPopup initialPromotions={popupItems} />
            <EagerImages />
          </AuthProvider>
        </SettingProvider>
      </body>
    </html>
  );
}
