import React from 'react';

import style from './buttonScrollTop.module.scss';

const { scrollTop, arrow } = style;

const ButtonScrollTop = () => {
  return (
    <a className={scrollTop} href="#">
      <span className={arrow}>&#10140;</span>
    </a>
  );
};

export default ButtonScrollTop;
