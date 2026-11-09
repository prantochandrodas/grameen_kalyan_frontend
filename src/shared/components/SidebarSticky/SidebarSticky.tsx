'use client';

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  FormEvent,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { BiSolidPhoneCall } from 'react-icons/bi';
import { IoIosMail } from 'react-icons/io';
import { RxCross2 } from 'react-icons/rx';
import { IoSearch } from 'react-icons/io5';

import style from './sidebarSticky.module.scss';
import ContactForm from './ContactForm/ContactForm';

const {
  sidebarSticky,
  iconBox,
  iconActive,
  divider,
  numberContainer,
  phoneLabel,
  phoneLink,
  container,
  positionContainer,
  visibleNumber,
  formContainer,
  visibleForm,
  exit,
  searchContainer,
  searchForm,
  searchBtn,
  errorText,
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
  const [searchValue, setSearchValue] = useState('');
  const [searchError, setSearchError] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const closeAll = useCallback(() => {
    setOpenPhone(false);
    setOpenSearch(false);
    setOpenContactForm(false);
    setSearchError('');
  }, []);

  // Esc key + outside click closes any open panel
  useEffect(() => {
    if (!openPhone && !openSearch && !openContactForm) return undefined;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAll();
    };
    const onOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        closeAll();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onOutsideClick);
    document.addEventListener('touchstart', onOutsideClick);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onOutsideClick);
      document.removeEventListener('touchstart', onOutsideClick);
    };
  }, [openPhone, openSearch, openContactForm, closeAll]);

  // Auto focus the search box when it opens
  useEffect(() => {
    if (!openSearch) return undefined;
    const timer = setTimeout(() => searchInputRef.current?.focus(), 300);
    return () => clearTimeout(timer);
  }, [openSearch]);

  if (pathname !== '/') return null;

  const handlePhoneToggle = () => {
    setOpenPhone((prev) => !prev);
    setOpenSearch(false);
    setOpenContactForm(false);
  };
  const handleSearchToggle = () => {
    setOpenSearch((prev) => !prev);
    setOpenPhone(false);
    setOpenContactForm(false);
    setSearchError('');
  };
  const handleContactFormToggle = () => {
    setOpenContactForm((prev) => !prev);
    setOpenPhone(false);
    setOpenSearch(false);
  };

  const resetSearch = () => {
    setSearchValue('');
    setSearchError('');
    setOpenSearch(false);
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = searchValue.trim();

    if (!value) {
      setSearchError('Please type something to search');
      return;
    }

    // Age website er page er sathe match koro
    const matchedPage = findPage(value);
    if (matchedPage) {
      router.push(matchedPage.path);
      resetSearch();
      return;
    }

    // Page na pele general search
    if (value.length <= 3) {
      setSearchError('Please enter more than 3 characters');
      return;
    }

    router.push(`/search/${encodeURIComponent(value)}`);
    resetSearch();
  };

  return (
    <div className={container} ref={wrapperRef}>
      <div className={positionContainer}>
        <div className={sidebarSticky}>
          <button
            type="button"
            className={`${iconBox} ${openSearch ? iconActive : ''}`}
            onClick={handleSearchToggle}
            aria-label="Search"
            aria-expanded={openSearch}
          >
            <img src="/images/search.png" alt="" />
          </button>
          <div className={divider} />
          <button
            type="button"
            className={`${iconBox} ${openPhone ? iconActive : ''}`}
            onClick={handlePhoneToggle}
            aria-label="Phone numbers"
            aria-expanded={openPhone}
          >
            <BiSolidPhoneCall />
          </button>
          <div className={divider} />
          <button
            type="button"
            className={`${iconBox} ${openContactForm ? iconActive : ''}`}
            onClick={handleContactFormToggle}
            aria-label="Contact form"
            aria-expanded={openContactForm}
          >
            <IoIosMail style={{ color: '#F7A220' }} />
          </button>
        </div>

        {/* Search */}
        <div
          className={`${searchContainer} ${openSearch ? visibleSearch : ''}`}
        >
          <form className={searchForm} onSubmit={handleSearch} role="search">
            <input
              ref={searchInputRef}
              type="search"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                if (searchError) setSearchError('');
              }}
              placeholder="Search pages or topics..."
              aria-label="Search"
            />
            <button type="submit" className={searchBtn} aria-label="Search">
              <IoSearch />
            </button>
            <button
              type="button"
              className={exit}
              onClick={closeAll}
              aria-label="Close search"
            >
              <RxCross2 />
            </button>
          </form>
          {searchError && (
            <p className={errorText} role="alert">
              {searchError}
            </p>
          )}
        </div>

        {/* Phone Numbers */}
        <div
          className={`${numberContainer} ${openPhone ? visibleNumber : ''}`}
        >
          <span className={phoneLabel}>Call Us</span>
          <a className={phoneLink} href="tel:+880244802111">
            +880244802111
          </a>
          <a className={phoneLink} href="tel:+8809642115500">
            +8809642115500
          </a>
        </div>

        {/* Contact Form */}
        <div
          className={`${formContainer} ${openContactForm ? visibleForm : ''}`}
        >
          <button
            type="button"
            className={exit}
            onClick={closeAll}
            aria-label="Close contact form"
          >
            <RxCross2 />
          </button>
          <ContactForm closeSidebar={closeAll} />
        </div>
      </div>
    </div>
  );
};

export default SidebarSticky;