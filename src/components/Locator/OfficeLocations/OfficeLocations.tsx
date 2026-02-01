/* eslint-disable comma-dangle */

import React from 'react';
import Image from 'next/image';

import layoutLT from '@/assets/layout/locator/GK_website_OPT_01_People_HealthForce-02.svg';
import { IOfficeLocationsProps } from './OfficeLocations.types';

import style from './officeLocations.module.scss';
import Link from 'next/link';
const {
  officeLocationContainer,
  locationContainer,
  locationCard,
  cardOne,
  cardTwo,
  layoutContainer,
  mainContainer,
  img,
  link,
} = style;

const OfficeLocations = ({ officeLocationsData }: IOfficeLocationsProps) => {
  return (
    <div className={mainContainer}>
      <div className={officeLocationContainer}>
        <div className={layoutContainer}>
          <Image className={img} src={layoutLT} alt="layout" />
        </div>
        <h2>Regional Office across Bangladesh</h2>

        <div className={locationContainer}>
          {officeLocationsData?.map((data, i) => (
            <div
              className={`${locationCard} ${i % 2 === 0 ? cardOne : cardTwo}`}
              key={data.id}
            >
              <h3>{data.title}</h3>
              <Link className={link} href={data.map_location} target="__blank">
                <p>{data.address}</p>
              </Link>
              <p>{data.contact_info}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OfficeLocations;
