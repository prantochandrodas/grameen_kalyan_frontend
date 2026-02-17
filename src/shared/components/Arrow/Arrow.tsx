'use client';

import React from 'react';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';

import style from './arrow.module.scss';

const { arrow, icon, prevArrow, nextArrow } = style;

const Arrow = ({ type = 'next', onClick, className }: any) => {
  return (
    <button
      className={`${arrow} ${type === 'prev' ? prevArrow : nextArrow} ${className}`}
      onClick={onClick}
    >
      {type === 'prev' ? (
        <IoChevronBackOutline className={icon} />
      ) : (
        <IoChevronForwardOutline className={icon} />
      )}
    </button>
  );
};

export default Arrow;
