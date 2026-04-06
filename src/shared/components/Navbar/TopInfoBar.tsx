import React from 'react';
import Link from 'next/link';
import { BiSolidPhoneCall } from 'react-icons/bi';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { FiPhone } from 'react-icons/fi';
import { FiMail } from 'react-icons/fi';
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
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
  locationRow,
  socialmedia,
  container,
  link,
  icon,
  facebookIcon,
  youtubeIcon,
  instagramIcon,
  linkdinIcon,
} = style;

const TopInfoBar = () => {
  return (
    <div className={topInfoBar}>
      <div className={topInfoItem} style={{ width: '42%', display: 'flex', alignItems: 'center', gap: '5px' }}>
        <div className={locationRow} style={{ marginRight: '30px' }}>
          {/* <span>  <img
            src="/images/location.png"
            alt="location"
            style={{
              width: '20px',
              height: '20px',
              marginRight: '5px',
              objectFit: 'contain'
            }}
          /></span> */}
          <a
            href="https://www.google.com/maps/place/Grameen+Kalyan/@23.8081239,90.3503437,20z/data=!4m6!3m5!1s0x3755c108eabc683b:0x3f4df94c55d19627!8m2!3d23.8082406!4d90.3503652!16s%2Fg%2F11rrjpsngc?entry=ttu&g_ep=EgoyMDI2MDMyOS4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>
              <img
                src="/images/location.png"
                alt="location"
                style={{
                  width: '20px',
                  height: '20px',
                  marginRight: '5px',
                  objectFit: 'contain',
                  cursor: 'pointer'
                }}
              />
            </span>
          </a>
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
        {/* <img
          src="/images/phonesdfjs.png"
          alt="phone"
          style={{
            width: '20px',
            height: '20px',
            marginRight: '5px',
            objectFit: 'contain'
          }}
        /> */}
        <BiSolidPhoneCall style={{ marginRight: '5px', fontSize: '20px', color: '#95c11f' }} />
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




      <div className={socialmedia}>
        <div className={container}>
          <Link
            className={link}
            href={'https://www.facebook.com/share/1Fam3kM6je/'}
            target="_blank"
          >
            <FaFacebookF className={`${icon} ${facebookIcon}`} />
          </Link>
          <Link
            className={link}
            href={'https://www.youtube.com/@GrameenKalyan1996'}
            target="_blank"
          >
            <FaYoutube className={`${icon} ${youtubeIcon}`} />
          </Link>
          <Link
            className={link}
            href={
              'https://www.instagram.com/explore/locations/118227903152262/grameen-kalyan/'
            }
            target="_blank"
          >
            <FaInstagram className={`${icon} ${instagramIcon}`} />
          </Link>

          <Link
            className={link}
            href={
              'https://www.linkedin.com/company/grameenkalyan/?originalSubdomain=bd'
            }
            target="_blank"
          >
            <FaLinkedinIn className={`${icon} ${linkdinIcon}`} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TopInfoBar;