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
  openMapsBtn,
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

  const handleTabKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    const last = schedules.length - 1;
    let next = index;

    if (e.key === 'ArrowRight') next = index === last ? 0 : index + 1;
    else if (e.key === 'ArrowLeft') next = index === 0 ? last : index - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    else return;

    e.preventDefault();
    setActiveId(schedules[next].id);
    document.getElementById(`hours-tab-${schedules[next].id}`)?.focus();
  };

  return (
    <div className={heroSection}>
      <div className={bgImageContainer}>
        {/* <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.286476263072!2d90.34785941118281!3d23.808409986457153!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c134aa8c4db7%3A0x9c24803a1413f9a9!2sGrameen%20Telecom%20Trust!5e0!3m2!1sen!2sbd!4v1690104837934!5m2!1sen!2sbd"></iframe> */}
        <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d456.28681477838296!2d90.3503437!3d23.8081239!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c108eabc683b%3A0x3f4df94c55d19627!2sGrameen%20Kalyan!5e0!3m2!1sen!2sbd!4v1775020631634!5m2!1sen!2sbd" title="Grameen Kalyan head office" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen></iframe>
        <a
          className={openMapsBtn}
          href="https://www.google.com/maps/search/?api=1&query=Grameen%20Kalyan%205th%20Floor%20Grameen%20Telecom%20Bhaban%20Mirpur%20Dhaka"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open Grameen Kalyan in Google Maps"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          Open in Maps
        </a>
      </div>
      <div className={content}>
        <h2 className={heading}>Opening Hours</h2>
        <div
          className={hoursTabs}
          role="tablist"
          aria-label="Select office type"
        >
          {schedules.map((item, index) => (
            <button
              key={item.id}
              id={`hours-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={item.id === activeId}
              aria-controls="hours-panel"
              tabIndex={item.id === activeId ? 0 : -1}
              onKeyDown={(e) => handleTabKeyDown(e, index)}
              className={
                item.id === activeId
                  ? `${hoursTab} ${hoursTabActive}`
                  : hoursTab
              }
              onClick={() => setActiveId(item.id)}
            >
              {item.tabLabel.split(' · ')[0]}
              {item.tabLabel.includes(' · ') && (
                <small>{item.tabLabel.split(' · ')[1]}</small>
              )}
            </button>
          ))}
        </div>
        <div
          key={activeSchedule.id}
          id="hours-panel"
          className={hoursPanel}
          role="tabpanel"
          aria-labelledby={`hours-tab-${activeSchedule.id}`}
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
            <p className={hoursTime}>
              {activeSchedule.time.split(' - ').map((part, i, arr) => (
                <React.Fragment key={part}>
                  <span>{i < arr.length - 1 ? `${part} -` : part}</span>{' '}
                </React.Fragment>
              ))}
            </p>
          </div>
        </div>
        <div className={layoutContainer}>
          <Image className={layoutImage} src={layoutImg} alt="layout" />
        </div>
        <div className={taglineFooter}>
          <Link href="#regional-locations">
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
