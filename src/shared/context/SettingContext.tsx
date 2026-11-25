'use client';

import React, { createContext, useContext } from 'react';

export interface ISetting {
  company_name?: string;
  email?: string;
  fav_icon?: string;
  logo?: string;
  footer_logo?: string;
  contact_number_one?: string;
  contact_number_two?: string;
  contact_number_three?: string;
  address?: string;
  map_link?: string;
  facebook_link?: string;
  instagram_link?: string;
  linkedin_link?: string;
  youtube_link?: string;
  copyright_text?: string;
  tag_line?: string;
}

const SettingContext = createContext<ISetting>({});

export const SettingProvider = ({
  value,
  children,
}: {
  value: ISetting;
  children: React.ReactNode;
}) => (
  <SettingContext.Provider value={value}>{children}</SettingContext.Provider>
);

export const useSetting = () => useContext(SettingContext);

// map_link jodi address text hoy tahole Google Maps search URL banay, URL hole sheta-i use kore
export const getMapUrl = (mapLink?: string) => {
  if (!mapLink) return '';
  return /^https?:\/\//i.test(mapLink)
    ? mapLink
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        mapLink
      )}`;
};