'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BiSolidDownArrow } from 'react-icons/bi';
import {
  FaFacebookF,
  FaYoutube,
  FaInstagram,
  FaLinkedinIn,
} from 'react-icons/fa';

import { IMAGE_BASE_URL } from '@/config';
import style from './mainNavbar.module.scss';

interface IDonate {
  id: number;
  name: string;
}

interface INavbarProps {
  badgeImage: string;
  logoImage: string;
  donates?: IDonate[];
}

interface IMenuItem {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
}

const socials = [
  { icon: FaFacebookF, href: 'https://www.facebook.com/share/1Fam3kM6je/' },
  { icon: FaYoutube, href: 'https://www.youtube.com/@GrameenKalyan1996' },
  {
    icon: FaInstagram,
    href: 'https://www.instagram.com/explore/locations/118227903152262/grameen-kalyan/',
  },
  {
    icon: FaLinkedinIn,
    href: 'https://www.linkedin.com/company/grameenkalyan/?originalSubdomain=bd',
  },
];

const Navbar = ({ badgeImage, logoImage, donates = [] }: INavbarProps) => {
  const pathName = usePathname();
  const [toggle, setToggle] = useState(false);
  // which dropdown is open on mobile (tap to open/close)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const safeDonates = Array.isArray(donates) ? donates : [];
  const logoSrc = IMAGE_BASE_URL + logoImage;
  const badgeSrc = IMAGE_BASE_URL + badgeImage;

  const menu: IMenuItem[] = [
    { label: 'home', href: '/' },
    { label: 'about us', href: '/about' },
    { label: 'services', href: '/services' },
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
                {m.label} <BiSolidDownArrow />
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

        {/* badge: shown only inside the mobile menu */}
        <li className={style.badgeItem}>
          <Image
            className={style.badge}
            src={badgeSrc}
            alt="badge"
            width={100}
            height={100}
          />
        </li>
      </ul>

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
