'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import { BiSolidDownArrow } from 'react-icons/bi';

import gkLogo from '@/assets/logo/gk-logo.svg';
import { IMAGE_BASE_URL } from '@/config';

import style from './navbar.module.scss';
import Link from 'next/link';
import TopInfoBar from './TopInfoBar';

const {
  navbar,
  logoContainer,
  logo,
  list,
  item,
  subItem,
  dropdownItem,
  dropdownList,
  itemText,
  menuBtn,
  openList,
  active,
  bar,
  badgeContainer,
  img,
  spaceBox,
  link,
  subItemNoBorder,
  activeItem,
  activeSubItem,
} = style;

interface INavbarProps {
  badgeImage: string;
}

const Navbar = ({ badgeImage }: INavbarProps) => {
  const pathName = usePathname();
  const [toggle, setToggle] = useState(false);
  const [isHomePage, setIsHomePage] = useState(false);
  const [isAboutPage, setIsAboutPage] = useState(false);
  const [isServicesPage, setIsServicesPage] = useState(false);
  const [isHealthcarePage, setIsHealthcarePage] = useState(false);
  const [isCorporatePage, setIsCorporatePage] = useState(false);
  const [isHealthForcePage, setIsHealthForcePage] = useState(false);
  const [isJoinUsPage, setIsJoinUsPage] = useState(false);
  const [isStoriesPage, setIsStoriesPage] = useState(false);
  const [isPhotoGalleryPage, setIsPhotoGalleryPage] = useState(false);
  const [isLocatorPage, setIsLocatorPage] = useState(false);
  const [isNewsletterPage, setIsNewsletterPage] = useState(false);
  const [isVideosPage, setIsVideosPage] = useState(false);
  const handleToggle = () => {
    setToggle(!toggle);
  };

  const badge = IMAGE_BASE_URL + badgeImage;
  // const isHomePage = pathName === '/';

  const handleActiveHomePage = (page: string) => {
    switch (page) {
      case 'home':
        setIsHomePage(true);
        setIsAboutPage(false);
        setIsServicesPage(false);
        setIsHealthcarePage(false);
        setIsCorporatePage(false);
        setIsHealthForcePage(false);
        setIsJoinUsPage(false);
        setIsStoriesPage(false);
        setIsPhotoGalleryPage(false);
        setIsLocatorPage(false);
        setIsNewsletterPage(false);
        break;
      case 'about':
        setIsHomePage(false);
        setIsAboutPage(true);
        setIsServicesPage(false);
        setIsHealthcarePage(false);
        setIsCorporatePage(false);
        setIsHealthForcePage(false);
        setIsJoinUsPage(false);
        setIsStoriesPage(false);
        setIsPhotoGalleryPage(false);
        setIsLocatorPage(false);
        setIsNewsletterPage(false);
        break;
      case 'services':
        setIsHomePage(false);
        setIsAboutPage(false);
        setIsServicesPage(true);
        setIsHealthcarePage(false);
        setIsCorporatePage(false);
        setIsHealthForcePage(false);
        setIsJoinUsPage(false);
        setIsStoriesPage(false);
        setIsPhotoGalleryPage(false);
        setIsLocatorPage(false);
        setIsNewsletterPage(false);
        break;
      case 'healthcare':
        setIsHomePage(false);
        setIsAboutPage(false);
        setIsServicesPage(false);
        setIsHealthcarePage(true);
        setIsCorporatePage(false);
        setIsHealthForcePage(false);
        setIsJoinUsPage(false);
        setIsStoriesPage(false);
        setIsPhotoGalleryPage(false);
        setIsLocatorPage(false);
        setIsNewsletterPage(false);
        break;
      case 'corporate':
        setIsHomePage(false);
        setIsAboutPage(false);
        setIsServicesPage(false);
        setIsHealthcarePage(false);
        setIsCorporatePage(true);
        setIsHealthForcePage(false);
        setIsJoinUsPage(false);
        setIsStoriesPage(false);
        setIsPhotoGalleryPage(false);
        setIsLocatorPage(false);
        setIsNewsletterPage(false);
        break;
      case 'health-force':
        setIsHomePage(false);
        setIsAboutPage(false);
        setIsServicesPage(false);
        setIsHealthcarePage(false);
        setIsCorporatePage(false);
        setIsHealthForcePage(true);
        setIsJoinUsPage(false);
        setIsStoriesPage(false);
        setIsPhotoGalleryPage(false);
        setIsLocatorPage(false);
        setIsNewsletterPage(false);
        break;
      case 'join-us':
        setIsHomePage(false);
        setIsAboutPage(false);
        setIsServicesPage(false);
        setIsHealthcarePage(false);
        setIsCorporatePage(false);
        setIsHealthForcePage(false);
        setIsJoinUsPage(true);
        setIsStoriesPage(false);
        setIsPhotoGalleryPage(false);
        setIsLocatorPage(false);
        setIsNewsletterPage(false);
        break;
      case 'stories':
        setIsHomePage(false);
        setIsAboutPage(false);
        setIsServicesPage(false);
        setIsHealthcarePage(false);
        setIsCorporatePage(false);
        setIsHealthForcePage(false);
        setIsJoinUsPage(false);
        setIsStoriesPage(true);
        setIsPhotoGalleryPage(false);
        setIsLocatorPage(false);
        setIsNewsletterPage(false);
        break;
      case 'photo-gallery':
        setIsHomePage(false);
        setIsAboutPage(false);
        setIsServicesPage(false);
        setIsHealthcarePage(false);
        setIsCorporatePage(false);
        setIsHealthForcePage(false);
        setIsJoinUsPage(false);
        setIsStoriesPage(false);
        setIsPhotoGalleryPage(true);
        setIsLocatorPage(false);
        setIsNewsletterPage(false);
        break;
      case 'locator':
        setIsHomePage(false);
        setIsAboutPage(false);
        setIsServicesPage(false);
        setIsHealthcarePage(false);
        setIsCorporatePage(false);
        setIsHealthForcePage(false);
        setIsJoinUsPage(false);
        setIsStoriesPage(false);
        setIsPhotoGalleryPage(false);
        setIsLocatorPage(true);
        setIsNewsletterPage(false);
        break;
      case 'videos':
        setIsVideosPage(true);
        break;
      case 'newsletter':
        setIsHomePage(false);
        setIsAboutPage(false);
        setIsServicesPage(false);
        setIsHealthcarePage(false);
        setIsCorporatePage(false);
        setIsHealthForcePage(false);
        setIsJoinUsPage(false);
        setIsStoriesPage(false);
        setIsPhotoGalleryPage(false);
        setIsLocatorPage(false);
        setIsNewsletterPage(true);
        break;

      default:
        break;
    }
  };

  const handleActivePage = (path: string) => {
    switch (path) {
      case '/':
        handleActiveHomePage('home');
        setToggle(false);
        break;
      case '/about':
        handleActiveHomePage('about');
        setToggle(false);
        break;
      case '/services':
        handleActiveHomePage('services');
        setToggle(false);
        break;
      case '/healthcare':
        handleActiveHomePage('healthcare');
        setToggle(false);
        break;
      case '/corporate':
        handleActiveHomePage('corporate');
        setToggle(false);
        break;
      case '/health-force':
        handleActiveHomePage('health-force');
        setToggle(false);
        break;
      case '/join-us':
        handleActiveHomePage('join-us');
        setToggle(false);
        break;
      case '/stories':
        handleActiveHomePage('stories');
        setToggle(false);
        break;
      case '/photo-gallery':
        handleActiveHomePage('photo-gallery');
        setToggle(false);
        break;
      case '/locator':
        handleActiveHomePage('locator');
        setToggle(false);
        break;
      case '/newsletter':
        handleActiveHomePage('newsletter');
        setToggle(false);
        break;
      case '/videos':
        handleActiveHomePage('videos');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    handleActivePage(pathName);
  }, [pathName]);

  return (
    <>
      <div className={navbar}>
        <TopInfoBar />
        <Link className={link} href="/">
          <div className={logoContainer}>
            <Image className={logo} src={gkLogo} alt="GK logo" priority />
          </div>
        </Link>
        <ul className={toggle ? `${list} ${openList}` : `${list}`}>
          <Link className={link} href="/" onClick={() => handleActivePage('/')}>
            <li className={isHomePage ? `${item} ${activeItem}` : `${item}`}>
              home
            </li>
          </Link>
          <Link
            className={link}
            href="/about"
            onClick={() => handleActivePage('/about')}
          >
            <li className={isAboutPage ? `${item} ${activeItem}` : `${item}`}>
              about us
            </li>
          </Link>
          <Link
            className={link}
            href="/services"
            onClick={() => handleActivePage('/services')}
          >
            <li
              className={isServicesPage ? `${item} ${activeItem}` : `${item}`}
            >
              services
            </li>
          </Link>
          <Link
            className={link}
            href="/healthcare"
            onClick={() => handleActivePage('/healthcare')}
          >
            <li
              className={isHealthcarePage ? `${item} ${activeItem}` : `${item}`}
            >
              healthcare
            </li>
          </Link>
          <li className={dropdownItem}>
            <span className={itemText}>
              people <BiSolidDownArrow />
            </span>
            <ul className={dropdownList}>
              <Link
                className={link}
                href="/corporate"
                onClick={() => handleActivePage('/corporate')}
              >
                <li
                  className={
                    isCorporatePage
                      ? `${subItem} ${activeSubItem}`
                      : `${subItem}`
                  }
                >
                  corporate
                </li>
              </Link>
              <Link
                className={link}
                href="/health-force"
                onClick={() => handleActivePage('/health-force')}
              >
                <li
                  className={
                    isHealthForcePage
                      ? `${subItem} ${activeSubItem}`
                      : `${subItem}`
                  }
                >
                  health force
                </li>
              </Link>
              <Link
                className={link}
                href="/join-us"
                onClick={() => handleActivePage('/join-us')}
              >
                <li
                  className={
                    isJoinUsPage
                      ? `${subItem} ${subItemNoBorder} ${activeSubItem}`
                      : `${subItem} ${subItemNoBorder}`
                  }
                >
                  join us
                </li>
              </Link>
            </ul>
          </li>
          <li className={dropdownItem}>
            <span className={itemText}>
              publication <BiSolidDownArrow />
            </span>
            <ul className={dropdownList}>
              <Link
                className={link}
                href="/stories"
                onClick={() => handleActivePage('/stories')}
              >
                <li
                  className={
                    isStoriesPage ? `${subItem} ${activeSubItem}` : `${subItem}`
                  }
                >
                  stories
                </li>
              </Link>
              <Link
                className={link}
                href="/newsletter"
                onClick={() => handleActivePage('/newsletter')}
              >
                <li
                  className={
                    isNewsletterPage
                      ? `${subItem} ${subItemNoBorder} ${activeSubItem}`
                      : `${subItem} ${subItemNoBorder}`
                  }
                >
                  Newsletter
                </li>
              </Link>
            </ul>
          </li>
          <li className={dropdownItem}>
            <span className={itemText}>
              gallery <BiSolidDownArrow />
            </span>
            <ul className={dropdownList}>
              <Link
                className={link}
                href="/photo-gallery"
                onClick={() => handleActivePage('/photo-gallery')}
              >
                <li
                  className={
                    isPhotoGalleryPage
                      ? `${subItem} ${subItemNoBorder} ${activeSubItem}`
                      : `${subItem} ${subItemNoBorder}`
                  }
                >
                  photo album
                </li>
              </Link>
              <Link
                className={link}
                href="/videos"
                onClick={() => handleActivePage('/videos')}
              >
                <li
                  className={
                    isVideosPage
                      ? `${subItem} ${subItemNoBorder} ${activeSubItem}`
                      : `${subItem} ${subItemNoBorder}`
                  }
                >
                  video album
                </li>
              </Link>
            </ul>
          </li>
          <Link
            className={link}
            href="/locator"
            onClick={() => handleActivePage('/locator')}
          >
            <li className={isLocatorPage ? `${item} ${activeItem}` : `${item}`}>
              locator
            </li>
          </Link>
          {!isHomePage ? (
            <li className={badgeContainer}>
              <Image
                className={img}
                src={badge}
                alt="badge img"
                width={100}
                height={100}
              />
            </li>
          ) : null}
          {!isHomePage || toggle ? <div className={spaceBox} /> : null}
        </ul>
        <button
          className={toggle ? `${menuBtn} ${active}` : `${menuBtn}`}
          onClick={handleToggle}
        >
          <span className={bar}></span>
        </button>
      </div>
    </>
  );
};

export default Navbar;
