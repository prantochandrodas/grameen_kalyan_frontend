import React from 'react';
import '../style/globals.scss';
// import { Inter } from 'next/font/google';

import {
  Navbar,
  Footer,
  SidebarSticky,
  ButtonScrollTop,
} from '@/shared/components';
import { useFetch } from '@/shared/hook';
import useFetchLaravelData from '@/shared/hook/useFetchData/useFetchData';

// const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Grameen Kalyan',
  description:
    'Grameen Kalyan believes in trust, quality and innovation in delivering services. We are on a mission to transform healthcare in Bangladesh at primary, ...',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navbarData = await useFetch({
    url: '/home-contents',
    revalidateIn: 86400,
  });
  // const navbarData = await useFetch({
  //   url: '/home-contents',
  //   revalidateIn: 86400,
  // });

  const donatesRes = await useFetchLaravelData({
    url: '/donates',
    revalidateIn: 3600,
  });

  // API shape: { success: true, data: [...] }
  // tai .data ber kore array na hole empty array pathacchi
  const donates = Array.isArray(donatesRes)
    ? donatesRes
    : (donatesRes?.data ?? []);

  const badgeImage = navbarData?.badge_image;
  const logoImage = navbarData?.navbar_logo;

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <Navbar
          badgeImage={badgeImage}
          logoImage={logoImage}
          donates={donates}
        />
        {children}
        <SidebarSticky />
        <Footer />
        <ButtonScrollTop />
      </body>
    </html>
  );
}
