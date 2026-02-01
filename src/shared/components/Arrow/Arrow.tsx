import React from 'react';

import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';

import style from './arrow.module.scss';
const { arrow, icon } = style;

const Arrow = ({ type = 'next', onClick }: { type: string; onClick?: any }) => {
  return (
    <button className={arrow} onClick={onClick}>
      {type === 'prev' ? (
        <IoChevronBackOutline className={icon} />
      ) : (
        <IoChevronForwardOutline className={icon} />
      )}
    </button>
  );
};

export default Arrow;
