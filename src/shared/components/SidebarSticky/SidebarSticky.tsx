'use client';

import React, { useState, KeyboardEvent } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { BiSolidPhoneCall } from 'react-icons/bi';
import { IoIosMail } from 'react-icons/io';
import { RxCross2 } from 'react-icons/rx';

import style from './sidebarSticky.module.scss';
import ContactForm from './ContactForm/ContactForm';

const {
  sidebarSticky,
  iconBox,
  divider,
  numberContainer,
  container,
  positionContainer,
  visibleNumber,
  formContainer,
  visibleForm,
  exit,
  searchContainer,
  visibleSearch,
} = style;

interface ISitePage {
  title: string;
  path: string;
  keywords: string[];
}

// Website er page list. Notun page hole ekhane add korben.
const SITE_PAGES: ISitePage[] = [
  { title: 'Home', path: '/', keywords: ['home', 'main', 'homepage'] },
  { title: 'About Us', path: '/about', keywords: ['about', 'about us', 'who we are'] },
  { title: 'Services', path: '/services', keywords: ['services', 'service'] },
  { title: 'Healthcare', path: '/healthcare', keywords: ['healthcare', 'health care', 'health'] },
  { title: 'Corporate', path: '/corporate', keywords: ['corporate', 'company'] },
  { title: 'Health Force', path: '/health-force', keywords: ['health force', 'health-force', 'healthforce'] },
  { title: 'Join Us', path: '/join-us', keywords: ['join', 'join us', 'career', 'jobs'] },
  { title: 'Stories', path: '/stories', keywords: ['stories', 'story'] },
  { title: 'Newsletter', path: '/newsletter', keywords: ['newsletter', 'news'] },
  { title: 'Photo Album', path: '/photo-gallery', keywords: ['photo', 'photo album', 'gallery', 'photo gallery'] },
  { title: 'Video Album', path: '/videos', keywords: ['video', 'videos', 'video album'] },
  { title: 'Locator', path: '/locator', keywords: ['locator', 'location', 'branch', 'map'] },
];

const normalize = (text: string) =>
  text.toLowerCase().trim().replace(/[-_]+/g, ' ').replace(/\s+/g, ' ');

// Page khuje ber kore. Pele ISitePage dibe, na pele undefined.
const findPage = (query: string): ISitePage | undefined => {
  const q = normalize(query);
  if (!q) return undefined;

  // 1. Exact match (title / path / keyword)
  const exact = SITE_PAGES.find(
    (page) =>
      normalize(page.title) === q ||
      normalize(page.path.replace('/', '')) === q ||
      page.keywords.some((k) => normalize(k) === q)
  );
  if (exact) return exact;

  // 2. Partial match (user "heal" likhle healthcare / health force dhorbe)
  return SITE_PAGES.find(
    (page) =>
      normalize(page.title).includes(q) ||
      page.keywords.some((k) => normalize(k).includes(q))
  );
};

const SidebarSticky = () => {
  const [openPhone, setOpenPhone] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [openContactForm, setOpenContactForm] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  if (pathname !== '/') return null;

  const handlePhoneToggle = () => {
    setOpenPhone(!openPhone);
    setOpenSearch(false);
    setOpenContactForm(false);
  };
  const handleSearchToggle = () => {
    setOpenSearch(!openSearch);
    setOpenPhone(false);
    setOpenContactForm(false);
  };
  const handleContactFormToggle = () => {
    setOpenContactForm(!openContactForm);
    setOpenPhone(false);
    setOpenSearch(false);
  };

  const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code !== 'Enter') return;

    const input = e.target as HTMLInputElement;
    const value = input.value.trim();

    if (!value) return;

    // Age website er page er sathe match koro
    const matchedPage = findPage(value);
    if (matchedPage) {
      router.push(matchedPage.path);
      input.value = '';
      setOpenSearch(false);
      return;
    }

    // Page na pele ager moto general search
    if (value.length <= 3) {
      alert('Please enter more than 3 characters');
      return;
    }

    router.push(`/search/${encodeURIComponent(value)}`);
    input.value = '';
    setOpenSearch(false);
  };

  return (
    <div className={container}>
      <div className={positionContainer}>
        <div className={sidebarSticky}>
          <div className={iconBox} onClick={() => handleSearchToggle()}>
            <img
              src="/images/search.png"
              alt="search"
              style={{
                width: '25px',
                height: '25px',
                marginRight: '5px',
                objectFit: 'contain',
              }}
            />
          </div>
          <div className={divider} />
          <div className={iconBox} onClick={() => handlePhoneToggle()}>
            <BiSolidPhoneCall />
          </div>
          <div className={divider} />
          <div className={iconBox} onClick={() => handleContactFormToggle()}>
            <IoIosMail style={{ color: '#F7A220' }} />
          </div>
        </div>

        {/* Search Input form */}
        <div
          className={
            openSearch
              ? `${searchContainer} ${visibleSearch}`
              : `${searchContainer}`
          }
        >
          <div className={exit} onClick={() => handleSearchToggle()}>
            <RxCross2 />
          </div>
          <input type="text" placeholder="Search..." onKeyUp={handleSearch} />
        </div>

        {/* Phone Number */}
        <div
          className={
            openPhone
              ? `${numberContainer} ${visibleNumber}`
              : `${numberContainer}`
          }
        >
          <p>+880244802111, +8809642115500</p>
        </div>

        {/* Contact Form */}
        <div
          className={
            openContactForm
              ? `${formContainer} ${visibleForm}`
              : `${formContainer}`
          }
        >
          <div className={exit} onClick={() => handleContactFormToggle()}>
            <RxCross2 />
          </div>
          <ContactForm closeSidebar={handleContactFormToggle} />
        </div>
      </div>
    </div>
  );
};

export default SidebarSticky;