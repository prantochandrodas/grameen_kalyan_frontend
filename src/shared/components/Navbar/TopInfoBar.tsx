import React from 'react';
import Link from 'next/link';
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from 'react-icons/fa';

import style from './navbar.module.scss';


const {
  topInfoBar,
  topInfoItem,
  topInfoSocial,
  locationRow
} = style;

const TopInfoBar = () => {
  return (
    <div className={topInfoBar}>
      <div className={topInfoItem} style={{ width: '42%' }}>
        <div className={locationRow}>
          <span>📍</span>
          <p>
            5th Floor, Grameen Telecom Bhaban, 53/1 Box Nagar, Mirpur 1, Dhaka
            1216, Bangladesh
          </p>
        </div>
      </div>

      <div className={topInfoItem}>
        📞 +880244802111 | +8809642115500 <br />
        ✉️ contact@grameenkalyan.com
      </div>

      <div className={topInfoSocial}>
        <Link
          href="https://www.facebook.com/GrameenKalyan.Official"
          target="_blank"
        >
          <FaFacebookF />
        </Link>
        <Link
          href="https://www.instagram.com/grameenkalyan/?hl=en"
          target="_blank"
        >
          <FaInstagram />
        </Link>
        <Link href="https://twitter.com/GrameenKalyan" target="_blank">
          <FaTwitter />
        </Link>
        <Link
          href="https://www.linkedin.com/company/grameenkalyan/"
          target="_blank"
        >
          <FaLinkedinIn />
        </Link>
      </div>
    </div>
  );
};

export default TopInfoBar;
