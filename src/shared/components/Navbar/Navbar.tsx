'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BiSolidDownArrow } from 'react-icons/bi';
import { FaUserCircle } from 'react-icons/fa';
import {
  FaFacebookF,
  FaYoutube,
  FaInstagram,
  FaLinkedinIn,
} from 'react-icons/fa';

import { IMAGE_BASE_URL } from '@/config';
// import {
//   getHealthPackageCartCount,
//   HEALTH_PACKAGE_CART_EVENT,
// } from '@/shared/utils/healthPackageCart';
import { useAuth } from '@/shared/context/AuthContext';
import { useSetting } from '@/shared/context/SettingContext';
import style from './mainNavbar.module.scss';
import LanguageSwitcher from './LanguageSwitcher';

interface IDonate {
  id: number;
  name: string;
}


interface IServiceItem {
  id: number;
  title: string;
}

interface INavbarProps {
  badgeImage: string;
  logoImage: string;
  donates?: IDonate[];
  services?: IServiceItem[];
}

interface IMenuItem {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
}

const Navbar = ({
  badgeImage,
  logoImage,
  donates = [],
  services = [],
}: INavbarProps) => {
  const pathName = usePathname();
  const [toggle, setToggle] = useState(false);
  // which dropdown is open on mobile (tap to open/close)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  // const [cartCount, setCartCount] = useState(0);
  const { user } = useAuth();
  // "Pranto Das" -> "Pranto" (shown next to the profile icon)
  const firstName = user ? user.name.trim().split(/\s+/)[0] : '';
  const setting = useSetting();

  // Instagram setting API te nei, tai ager link ta-i thakbe
  const socials = [
    { icon: FaFacebookF, href: setting.facebook_link },
    { icon: FaYoutube, href: setting.youtube_link },
    { icon: FaInstagram, href: setting.instagram_link },
    { icon: FaLinkedinIn, href: setting.linkedin_link },
  ].filter((s) => s.href) as { icon: typeof FaFacebookF; href: string }[];

  const safeDonates = Array.isArray(donates) ? donates : [];
  const safeServices = Array.isArray(services) ? services : [];
  const logoSrc = setting.logo || IMAGE_BASE_URL + logoImage;
  const badgeSrc = IMAGE_BASE_URL + badgeImage;

  const menu: IMenuItem[] = [
    { label: 'home', href: '/' },
    { label: 'about us', href: '/about' },
    // { label: 'services', href: '/services' },
    // {
    //   label: 'services',
    //   children: safeServices
    //     .filter((s) => s.title !== 'Healthcare') // healthcare has its own menu
    //     .map((s) => ({
    //       label: s.title,
    //       href: `/services/${s.id}`,
    //     })),
    // },
    // { label: 'healthcare', href: '/healthcare' },

    {
      label: 'services',
      children: [
        { label: 'healthcare Packages', href: '/health-packages' },
        { label: 'healthcare', href: '/healthcare' },
        ...safeServices
          .filter((s) => s.title !== 'Healthcare') // avoid duplicate healthcare
          .map((s) => ({
            label: s.title,
            href: `/services/${s.id}`,
          })),
      ],
    },
    { label: 'healthcare', href: '/healthcare' },
    {
      label: 'people',
      children: [
        { label: 'corporate', href: '/corporate' },
        { label: 'health force', href: '/health-force' },
        { label: 'join us', href: '/join-us' },
      ],
    },
    {
      label: 'publication',
      children: [
        // { label: 'notes', href: '/notes' },
        { label: 'stories', href: '/stories' },
        { label: 'newsletter', href: '/newsletter' },
      ],
    },
    {
      label: 'gallery',
      children: [
        { label: 'photo album', href: '/photo-gallery' },
        { label: 'video album', href: '/videos' },
      ],
    },
    {
      label: 'donate',
      children: safeDonates.map((d) => ({
        label: d.name,
        href: `/donates/${d.id}`,
      })),
    },
    { label: 'locator', href: '/locator' },
  ];

  // close the mobile menu whenever the page changes
  useEffect(() => {
    setToggle(false);
    setOpenDropdown(null);
  }, [pathName]);

  // useEffect(() => {
  //   const syncCartCount = () => setCartCount(getHealthPackageCartCount());

  //   syncCartCount();
  //   window.addEventListener(HEALTH_PACKAGE_CART_EVENT, syncCartCount);
  //   window.addEventListener('storage', syncCartCount);
  //   return () => {
  //     window.removeEventListener(HEALTH_PACKAGE_CART_EVENT, syncCartCount);
  //     window.removeEventListener('storage', syncCartCount);
  //   };
  // }, []);

  // stop the page behind from scrolling while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = toggle ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [toggle]);

  const isActive = (href: string) => pathName === href;

  return (
    <nav className={style.navbar}>
      <Link className={style.logoLink} href="/">
        <Image
          className={style.logo}
          src={logoSrc}
          alt="GK logo"
          width={150}
          height={60}
          priority
        />
      </Link>

      <ul className={`${style.menu} ${toggle ? style.menuOpen : ''}`}>
        {menu.map((m) =>
          m.children ? (
            <li
              key={m.label}
              className={`${style.item} ${style.hasDropdown} ${openDropdown === m.label ? style.dropdownOpen : ''
                }`}
            >
              <span
                role="button"
                tabIndex={0}
                aria-haspopup="true"
                aria-expanded={openDropdown === m.label}
                className={`${style.link} ${m.children.some((c) => isActive(c.href)) ? style.active : ''
                  }`}
                onClick={() =>
                  setOpenDropdown(openDropdown === m.label ? null : m.label)
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setOpenDropdown(openDropdown === m.label ? null : m.label);
                  }
                }}
              >
                <span>{m.label}</span>
                <BiSolidDownArrow className={style.chevron} />
              </span>
              <ul className={style.dropdown}>
                {m.children.map((c) => (
                  <li key={c.href}>
                    <Link
                      href={c.href}
                      className={`${style.subLink} ${isActive(c.href) ? style.active : ''
                        }`}
                    >
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ) : (
            <li key={m.label} className={style.item}>
              <Link
                href={m.href!}
                className={`${style.link} ${isActive(m.href!) ? style.active : ''
                  }`}
              >
                {m.label}
              </Link>
            </li>
          )
        )}

        {/* mobile menu footer: socials + badge (hidden on desktop) */}
        <li className={style.mobileFooter}>
          <div className={style.mobileSocial}>
            {socials.map(({ icon: Icon, href }) => (
              <Link
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={style.mobileSocialIcon}
              >
                <Icon />
              </Link>
            ))}
          </div>
          <Image
            className={style.badge}
            src={badgeSrc}
            alt="badge"
            width={100}
            height={100}
          />
        </li>
      </ul>

      <div className={style.navRight}>
        {/* <LanguageSwitcher /> */}
        {user && firstName && (
          <Link
            href="/dashboard"
            className={style.loginName}
            title={user.name}
            aria-hidden="true"
            tabIndex={-1}
          >
            {firstName}
          </Link>
        )}
        <Link
          href={user ? '/dashboard' : '/login'}
          className={`${style.cartLink} ${style.loginLink}`}
          aria-label={user ? `My Account (${user.name})` : 'Login to My Account'}
          title={user ? user.name : 'Login to My Account'}
        >
          {user?.avatar ? (
            <span
              className={style.loginAvatar}
              role="img"
              aria-hidden="true"
              style={{ backgroundImage: `url("${user.avatar}")` }}
            />
          ) : (
            <FaUserCircle aria-hidden="true" />
          )}
          {user && <span className={style.loginDot} aria-hidden="true" />}
        </Link>
        
        {/* <Link
          href="/cart"
          className={style.cartLink}
          aria-label={`Health package cart, ${cartCount} ${
            cartCount === 1 ? 'package' : 'packages'
          }`}
          title="View health package cart"
        >
          <FaShoppingCart aria-hidden="true" />
          {cartCount > 0 && (
            <span className={style.cartBadge} aria-hidden="true">
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          )}
        </Link> */}

        <div className={style.social}>
          {socials.map(({ icon: Icon, href }) => (
            <Link
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={style.socialIcon}
            >
              <Icon />
            </Link>
          ))}
        </div>
      </div>

      <button
        className={`${style.menuBtn} ${toggle ? style.menuBtnActive : ''}`}
        onClick={() => setToggle(!toggle)}
        aria-label="Toggle menu"
        aria-expanded={toggle}
      >
        <span className={style.bar} />
      </button>
    </nav>
  );
};

export default Navbar;
