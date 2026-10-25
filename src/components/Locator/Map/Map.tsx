'use client';

/* eslint-disable comma-dangle */

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import layoutImg from '@/assets/layout/layout-tr-small.svg';
import arrowIcon from '@/assets/icons/arrow-left.svg';

import style from './map.module.scss';

const {
  heroSection,
  bgImageContainer,
  content,
  heading,
  layoutContainer,
  layoutImage,
  hoursTabs,
  hoursTab,
  hoursTabActive,
  hoursPanel,
  hoursTitle,
  hoursDays,
  hoursTime,
  hoursIcon,
  hoursInfo,
  taglineFooter,
} = style;

const schedules = [
  {
    id: 'head',
    tabLabel: 'Head Office',
    title: 'Head Office',
    days: 'Sunday - Thursday',
    time: '10:00 AM - 5:00 PM',
  },
  {
    id: 'regional',
    tabLabel: 'Regional · Sat-Wed',
    title: 'Regional Office And Health Centers',
    days: 'Saturday - Wednesday',
    time: '9:00 AM - 5:00 PM',
  },
  {
    id: 'regionalThu',
    tabLabel: 'Regional · Thu',
    title: 'Regional Office And Health Centers',
    days: 'Thursday',
    time: '9:00 AM - 2:00 PM',
  },
];

const Map = () => {
  const [activeId, setActiveId] = useState(schedules[0].id);
  const activeSchedule =
    schedules.find((item) => item.id === activeId) ?? schedules[0];
  return (
    <div className={heroSection}>
      <div className={bgImageContainer}>
        {/* <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.286476263072!2d90.34785941118281!3d23.808409986457153!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c134aa8c4db7%3A0x9c24803a1413f9a9!2sGrameen%20Telecom%20Trust!5e0!3m2!1sen!2sbd!4v1690104837934!5m2!1sen!2sbd"></iframe> */}
        <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d456.28681477838296!2d90.3503437!3d23.8081239!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c108eabc683b%3A0x3f4df94c55d19627!2sGrameen%20Kalyan!5e0!3m2!1sen!2sbd!4v1775020631634!5m2!1sen!2sbd"></iframe>
      </div>
      <div className={content}>
        <h2 className={heading}>Opening Hours</h2>
        <div
          className={hoursTabs}
          role="tablist"
          aria-label="Select office type"
        >
          {schedules.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={item.id === activeId}
              className={
                item.id === activeId
                  ? `${hoursTab} ${hoursTabActive}`
                  : hoursTab
              }
              onClick={() => setActiveId(item.id)}
            >
              {item.tabLabel}
            </button>
          ))}
        </div>
        <div
          key={activeSchedule.id}
          className={hoursPanel}
          role="tabpanel"
          aria-live="polite"
        >
          <span className={hoursIcon} aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="9" />
              <polyline points="12 7 12 12 15 14" />
            </svg>
          </span>
          <div className={hoursInfo}>
            <p className={hoursTitle}>{activeSchedule.title}</p>
            <p className={hoursDays}>{activeSchedule.days}</p>
            <p className={hoursTime}>{activeSchedule.time}</p>
          </div>
        </div>
        <div className={layoutContainer}>
          <Image className={layoutImage} src={layoutImg} alt="layout" />
        </div>
        <div className={taglineFooter}>
          <Link href="#">
            {/* sf */}
            <Image src={arrowIcon} alt="" />
            See our regional locations on the map
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Map;
