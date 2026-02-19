import React from 'react';
import Link from 'next/link';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { FiPhone } from 'react-icons/fi';
import { FiMail } from 'react-icons/fi';
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaPhoneAlt,
} from 'react-icons/fa';

import style from './navbar.module.scss';


const {
  addressText,
  topInfoBar,
  topInfoItem,
  topInfoSocial,
  iconBox,
  instaiconBox,
  linkDiniconBox,
  twitericonBox,
  locationRow
} = style;

const TopInfoBar = () => {
  return (
    <div className={topInfoBar}>
      <div className={topInfoItem} style={{ width: '42%', display: 'flex', alignItems: 'center', gap: '5px' }}>
        <div className={locationRow} style={{ marginRight: '30px' }}>
          <span>  <img
            src="/images/location.png"
            alt="location"
            style={{
              width: '20px',
              height: '20px',
              marginRight: '5px',
              objectFit: 'contain'
            }}
          /></span>
          {/* <span>  <FaMapMarkerAlt style={{ color: 'white', fontSize: '15px', marginRight: '5px' }} /></span> */}
          <p className={addressText}>
            5th Floor, Grameen Telecom Bhaban, 53/1 Box Nagar, Mirpur 1, Dhaka
            1216, Bangladesh
          </p>
        </div>
      </div>

      <div className={topInfoItem} style={{
        display: 'flex', alignItems: 'center', gap: '5px'
      }}>
        {/* <FaPhoneAlt style={{ marginRight: '5px', fontSize: '20px', color: '#ffffff' }} /> */}
        <img
          src="/images/phonesdfjs.png"
          alt="phone"
          style={{
            width: '20px',
            height: '20px',
            marginRight: '5px',
            objectFit: 'contain'
          }}
        />
        +880244802111 | +8809642115500

      </div>
      <div
        className={topInfoItem}
        style={{
          display: 'flex', alignItems: 'center', gap: '5px', marginRight: '30px'
        }}
      >
        {/* <FiMail style={{ fontSize: '20px', color: '#ffffff' }} /> */}
        <img
          src="/images/gmail.png"
          alt="gmail"
          style={{
            width: '20px',
            height: '20px',
            marginRight: '5px',
            objectFit: 'contain'
          }}
        />
        contact@grameenkalyan.com
      </div>

      <div className={topInfoSocial}>
        <Link
          href="https://www.facebook.com/GrameenKalyan.Official"
          target="_blank"
          rel="noopener noreferrer"
          className={iconBox}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            fill="#ffffff"
          >
            <path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z" />
          </svg>
        </Link>
        {/* <Link
          href="https://www.instagram.com/grameenkalyan/?hl=en"
          target="_blank"
        >
          <FaInstagram />
        </Link> */}
        <Link
          href="https://www.instagram.com/grameenkalyan/?hl=en"
          target="_blank"
          rel="noopener noreferrer"
          className={instaiconBox}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 448 512"
            width="20"
            height="20"
            fill="#ffffff"
          >
            <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
          </svg>
        </Link>
        {/* <Link href="https://twitter.com/GrameenKalyan" target="_blank">
          <FaTwitter />
        </Link> */}
        <Link
          href="https://www.youtube.com/@GrameenKalyan1996"
          target="_blank"
          rel="noopener noreferrer"
          className={twitericonBox} // you can rename this class if needed
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 576 512"
            width="20"
            height="20"
            fill="#ffffff"
          >
            <path d="M549.655 124.083c-6.281-23.65-24.813-42.182-48.466-48.464C456.004 64 288 64 288 64s-168.004 0-213.189 11.619c-23.653 6.282-42.185 24.815-48.466 48.464C16.726 169.266 16 256 16 256s.726 86.734 10.345 131.917c6.281 23.65 24.813 42.182 48.466 48.464C119.996 448 288 448 288 448s168.004 0 213.189-11.619c23.653-6.282 42.185-24.815 48.466-48.464C559.274 342.734 560 256 560 256s-.726-86.734-10.345-131.917zM232 334.9V177.1L345 256 232 334.9z" />
          </svg>
        </Link>

        {/* <Link
          href="https://www.linkedin.com/company/grameenkalyan/"
          target="_blank"
        >
          <FaLinkedinIn />
        </Link> */}
        <Link
          href="https://www.linkedin.com/company/grameenkalyan/"
          target="_blank"
          rel="noopener noreferrer"
          className={linkDiniconBox}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 448 512"
            width="20"
            height="20"
            fill="#ffffff"
          >
            <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default TopInfoBar;
