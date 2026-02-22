'use client';

import React, { useState, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';

import { FaSearch } from 'react-icons/fa';
import { BiSolidPhoneCall } from 'react-icons/bi';
import { IoIosMail } from 'react-icons/io';
import { RxCross2 } from 'react-icons/rx';

import style from './sidebarSticky.module.scss';
import ContactForm from './ContactForm/ContactForm';

const {
  sidebarSticky,
  iconBox,
  divider,
  numberContainer,
  container,
  positionContainer,
  visibleNumber,
  formContainer,
  visibleForm,
  exit,
  searchContainer,
  visibleSearch,
} = style;

const SidebarSticky = () => {
  const [openPhone, setOpenPhone] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [openContactForm, setOpenContactForm] = useState(false);

  const handlePhoneToggle = () => {
    setOpenPhone(!openPhone);
    setOpenSearch(false);
    setOpenContactForm(false);
  };
  const handleSearchToggle = () => {
    setOpenSearch(!openSearch);
    setOpenPhone(false);
    setOpenContactForm(false);
  };
  const handleContactFormToggle = () => {
    setOpenContactForm(!openContactForm);
    setOpenPhone(false);
    setOpenSearch(false);
  };

  const router = useRouter();

  const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter') {
      if ((e.target as HTMLInputElement).value.length <= 3) {
        alert('Please enter more than 3 characters');
      }
      if ((e.target as HTMLInputElement).value.length >= 3) {
        router.push(`/search/${(e.target as HTMLInputElement).value}`);
      }
      setOpenSearch(false);
    }
  };

  return (
    <div className={container}>
      <div className={positionContainer}>
        <div className={sidebarSticky}>
          <div className={iconBox} onClick={() => handleSearchToggle()}>
            <img
              src="/images/search.png"
              alt="search"
              style={{
                width: '25px',
                height: '25px',
                marginRight: '5px',
                objectFit: 'contain',
              }}
            />
            {/* <FaSearch /> */}
          </div>
          <div className={divider} />
          <div className={iconBox} onClick={() => handlePhoneToggle()}>
            {/* <img
              src="/images/phonesdfjs.png"
              alt="phone"
              style={{
                width: '25px',
                height: '25px',
                marginRight: '5px',
                objectFit: 'contain',
              }}
            /> */}
            <BiSolidPhoneCall />
          </div>
          <div className={divider} />
          <div className={iconBox} onClick={() => handleContactFormToggle()}>
            <IoIosMail style={{ color: '#F7A220' }} />
            {/* <img
              src="/images/gmail.png"
              alt="gmail"
              style={{
                width: '25px',
                height: '25px',
                marginRight: '5px',
                objectFit: 'contain'
              }}
            /> */}
          </div>
        </div>

        {/* Search Input form */}
        <div
          className={
            openSearch
              ? `${searchContainer} ${visibleSearch}`
              : `${searchContainer}`
          }
        >
          <div className={exit} onClick={() => handleSearchToggle()}>
            <RxCross2 />
          </div>
          <input type="text" placeholder="Search..." onKeyUp={handleSearch} />
        </div>
        {/* Phone Number */}
        <div
          className={
            openPhone
              ? `${numberContainer} ${visibleNumber}`
              : `${numberContainer}`
          }
        >
          <p>+880244802111, +8809642115500</p>
        </div>
        {/* Contact Form */}
        <div
          className={
            openContactForm
              ? `${formContainer} ${visibleForm}`
              : `${formContainer}`
          }
        >
          <div className={exit} onClick={() => handleContactFormToggle()}>
            <RxCross2 />
          </div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
};

export default SidebarSticky;
