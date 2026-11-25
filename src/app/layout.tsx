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
  const navbarData = await useFetchLaravelData({
    url: '/home-contents',
    revalidateIn: 86400,
  });
  // const navbarData = await useFetch({
  //   url: '/home-contents',
  //   revalidateIn: 86400,
  // });

  // services list for navbar dropdown (same API as services page)
  const servicesRes = await useFetchLaravelData({
    url: '/service-contents/services',
    revalidateIn: 86400,
  });

  const services = Array.isArray(servicesRes)
    ? servicesRes
    : (servicesRes?.data ?? []);

  const donatesRes = await useFetchLaravelData({
    url: '/donates',
    revalidateIn: 3600,
  });

  // API shape: { success: true, data: [...] }
  // tai .data ber kore array na hole empty array pathacchi
  const donates = Array.isArray(donatesRes)
    ? donatesRes
    : (donatesRes?.data ?? []);

  const settingRes = await useFetchLaravelData({
    url: '/setting',
    revalidateIn: 3600,
  });
  const setting = settingRes?.data ?? {};

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
            <OpeningPopup />
          </AuthProvider>
        </SettingProvider>
      </body>
    </html>
  );
}
