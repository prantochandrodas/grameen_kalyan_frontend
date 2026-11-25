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
  FaInstagram,
} from 'react-icons/fa6';

import { IMAGE_BASE_URL } from '@/config';
import { useSetting, getMapUrl } from '@/shared/context/SettingContext';
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

interface IFooterProps {
  logoImage?: string;
}

const Footer = ({ logoImage }: IFooterProps) => {
  const setting = useSetting();
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const [taglineVisible, setTaglineVisible] = useState(false);
  const [typedCount, setTypedCount] = useState(0);
  const currentYear = new Date().getFullYear();
  const logoSrc =
    setting.footer_logo || (logoImage ? IMAGE_BASE_URL + logoImage : '');

  const TAGLINE = setting.tag_line || '';

  const phones = [
    setting.contact_number_one,
    setting.contact_number_two,
    setting.contact_number_three,
  ].filter(Boolean) as string[];

  // "5th Floor,Grameen Telecom Bhaban,53/1 Box Nagar, Mirpur 1,..." ke ager moto 4 line a bhag kore
  const addressLines = (setting.address || '').split(/,(?=\S)/);

  const whatsappNumber = (setting.contact_number_one || '').replace(/\D/g, '');

  const socialLinks = [
    { name: 'Facebook', href: setting.facebook_link || '', Icon: FaFacebookF },
    { name: 'Instagram', href: setting.instagram_link || '', Icon: FaInstagram },
    { name: 'LinkedIn', href: setting.linkedin_link || '', Icon: FaLinkedinIn },
    { name: 'YouTube', href: setting.youtube_link || '', Icon: FaYoutube },
    {
      name: 'WhatsApp',
      href: whatsappNumber ? `https://wa.me/${whatsappNumber}` : '',
      Icon: FaWhatsapp,
    },
  ].filter((s) => s.href);

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
  }, [taglineVisible, TAGLINE]);

  return (
    <footer className={footer}>
      <div className={contentContainer}>
        <div className={logoContainer}>
          {logoSrc && (
            <Image
              className={logo}
              src={logoSrc}
              alt={setting.company_name || 'Grameen Kalyan'}
              width={300}
              height={120}
            />
          )}
        </div>
        <div className={address}>
          <h3 className={title}>Address</h3>
          <a
            className={`${row} ${mapLink}`}
            href={getMapUrl(setting.map_link)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Grameen Kalyan address in Google Maps"
          >
            <span className={iconCircle}>
              <FaLocationDot />
            </span>
            <p className={text}>
              {addressLines.map((line, i) => (
                <React.Fragment key={line}>
                  {line.trim()}
                  {i < addressLines.length - 1 && (
                    <>
                      ,<br />
                    </>
                  )}
                </React.Fragment>
              ))}
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
              {phones.map((phone) => (
                <a key={phone} href={`tel:${phone}`}>
                  {phone}
                </a>
              ))}
            </div>
          </div>
          <div className={row}>
            <span className={iconCircle}>
              <FaEnvelope />
            </span>
            <a className={text} href={`mailto:${setting.email}`}>
              {setting.email}
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
            © <span suppressHydrationWarning>{currentYear}</span>{' '}
            {setting.copyright_text}
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