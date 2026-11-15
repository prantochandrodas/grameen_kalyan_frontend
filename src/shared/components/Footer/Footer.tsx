'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
  FaWhatsapp,
  FaLocationDot,
  FaPhone,
  FaEnvelope,
} from 'react-icons/fa6';

import { IMAGE_BASE_URL } from '@/config';
import footerIcon from '@/assets/images/favicon-footer.png';

import style from './footer.module.scss';

const {
  footer,
  contentContainer,
  logoContainer,
  logo,
  address,
  contact,
  socialmedia,
  container,
  link,
  title,
  row,
  iconCircle,
  text,
  mapLink,
  bottomBar,
  wave,
  waveLight,
  waveDark,
  bottomContent,
  copywrite,
  tagline,
  taglineDivider,
  taglineText,
  taglineGhost,
  taglineTyped,
  cursor,
  visible,
  leaf,
} = style;

const socialLinks = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/share/1Fam3kM6je/',
    Icon: FaFacebookF,
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/grameenkalyan/?originalSubdomain=bd',
    Icon: FaLinkedinIn,
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@GrameenKalyan1996',
    Icon: FaYoutube,
  },
  {
    name: 'WhatsApp',
    href: 'https://wa.me/8801334944640',
    Icon: FaWhatsapp,
  },
];

const TAGLINE = 'In Healthcare, Right by Your Side';

const MAP_URL = 'https://maps.app.goo.gl/TMyPosrVYwkzaKKK7';

interface IFooterProps {
  logoImage?: string;
}

const Footer = ({ logoImage }: IFooterProps) => {
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const [taglineVisible, setTaglineVisible] = useState(false);
  const [typedCount, setTypedCount] = useState(0);
  const currentYear = new Date().getFullYear();
  const logoSrc = logoImage ? IMAGE_BASE_URL + logoImage : '';

  useEffect(() => {
    const el = taglineRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTaglineVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!taglineVisible) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTypedCount(TAGLINE.length);
      return;
    }

    let i = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (!deleting) {
        i += 1;
        setTypedCount(i);
        if (i === TAGLINE.length) {
          deleting = true;
          timer = setTimeout(tick, 2500); // hold full text
          return;
        }
        timer = setTimeout(tick, 70); // typing speed
      } else {
        i -= 1;
        setTypedCount(i);
        if (i === 0) {
          deleting = false;
          timer = setTimeout(tick, 600); // pause before retyping
          return;
        }
        timer = setTimeout(tick, 35); // erasing speed
      }
    };

    timer = setTimeout(tick, 600);
    return () => clearTimeout(timer);
  }, [taglineVisible]);

  return (
    <footer className={footer}>
      <div className={contentContainer}>
        <div className={logoContainer}>
          {logoSrc && (
            <Image
              className={logo}
              src={logoSrc}
              alt="Grameen Kalyan"
              width={300}
              height={120}
            />
          )}
        </div>
        <div className={address}>
          <h3 className={title}>Address</h3>
          <a
            className={`${row} ${mapLink}`}
            href={MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Grameen Kalyan address in Google Maps"
          >
            <span className={iconCircle}>
              <FaLocationDot />
            </span>
            <p className={text}>
              5th Floor,
              <br />
              Grameen Telecom Bhaban,
              <br />
              53/1 Box Nagar, Mirpur 1,
              <br />
              Dhaka 1216, Bangladesh
            </p>
          </a>
        </div>

        <div className={contact}>
          <h3 className={title}>Contact Us</h3>
          <div className={row}>
            <span className={iconCircle}>
              <FaPhone />
            </span>
            <div className={text}>
              <a href="tel:+8801334944640">+8801334944640</a>
              <a href="tel:+880244802111">+880244802111</a>
              <a href="tel:+8809642115500">+8809642115500</a>
            </div>
          </div>
          <div className={row}>
            <span className={iconCircle}>
              <FaEnvelope />
            </span>
            <a className={text} href="mailto:contact@grameenkalyan.com">
              contact@grameenkalyan.com
            </a>
          </div>
        </div>

        <div className={socialmedia}>
          <h3 className={title}>Follow Us</h3>
          <div className={container}>
            {socialLinks.map(({ name, href, Icon }) => (
              <Link
                key={name}
                className={link}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
              >
                <Icon />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className={bottomBar}>
        <svg
          className={wave}
          viewBox="0 0 1440 160"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            className={waveLight}
            d="M0,40 C200,0 460,10 760,60 C1060,105 1260,70 1440,20 L1440,160 L0,160 Z"
          />
          <path
            className={waveDark}
            d="M0,70 C200,35 460,45 760,90 C1060,125 1260,95 1440,50 L1440,160 L0,160 Z"
          />
        </svg>

        <div className={bottomContent}>
          <p className={copywrite}>
            © <span suppressHydrationWarning>{currentYear}</span> Grameen Kalyan.
            All Rights Reserved.
          </p>
          <p
            ref={taglineRef}
            className={`${tagline} ${taglineVisible ? visible : ''}`}
          >
            <Image className={leaf} src={footerIcon} alt="" aria-hidden="true" />
            <span className={taglineDivider} />
            <span className={taglineText}>
              <span className={taglineGhost}>{TAGLINE}</span>
              <span className={taglineTyped} aria-hidden="true">
                {TAGLINE.slice(0, typedCount)}
                <span className={cursor} />
              </span>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;