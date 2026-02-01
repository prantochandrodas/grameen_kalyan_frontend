'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from 'react-icons/fa6';

import gkLogo from '@/assets/logo/gk-logo.svg';

import style from './footer.module.scss';

const {
  footer,
  logoContainer,
  logo,
  contentContainer,
  address,
  addressTitle,
  addressData,
  contact,
  phoneTitle,
  phoneData,
  emailTitle,
  emailData,
  socialmedia,
  container,
  link,
  copywrite,
  icon,
} = style;

const Footer = () => {
  return (
    <div className={footer}>
      <div className={logoContainer}>
        <Image className={logo} src={gkLogo} alt="logo" />
      </div>
      <div className={contentContainer}>
        <div className={address}>
          <div className={addressTitle}>
            <p>A:</p>
          </div>
          <div className={addressData}>
            <p>
              5th Floor,
              <br />
              Grameen Telecom Bhaban,
              <br />
              53/1 Box Nagar, Mirpur 1,
              <br />
              Dhaka 1216, Bangladesh
            </p>
          </div>
        </div>
        <div className={contact}>
          <div className={phoneTitle}>
            <p>T:</p>
          </div>
          <div className={phoneData}>
            <p>
              +880244802111
              <br />
              +8809642115500
            </p>
          </div>
          <div className={emailTitle}>
            <p>E:</p>
          </div>
          <div className={emailData}>
            <p>contact@grameenkalyan.com</p>
          </div>
        </div>
        <div className={socialmedia}>
          <div className={container}>
            <Link
              className={link}
              href={'https://www.facebook.com/grameenkalyan/'}
              target="_blank"
            >
              <FaFacebookF className={icon} />
            </Link>
            <Link
              className={link}
              href={
                'https://www.instagram.com/explore/locations/118227903152262/grameen-kalyan/'
              }
              target="_blank"
            >
              <FaInstagram className={icon} />
            </Link>
            <Link
              className={link}
              href={'https://twitter.com/GrameenKalyan'}
              target="_blank"
            >
              <FaTwitter className={icon} />
            </Link>
            <Link
              className={link}
              href={
                'https://www.linkedin.com/company/grameenkalyan/?originalSubdomain=bd'
              }
              target="_blank"
            >
              <FaLinkedinIn className={icon} />
            </Link>
          </div>
          <p className={copywrite}>
            Copyright © 2023 Grameen Kalyan. All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
