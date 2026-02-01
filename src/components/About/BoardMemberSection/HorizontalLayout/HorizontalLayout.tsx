import React from 'react';

import style from './horizontalLayout.module.scss';

const { horiLayout, horiLineLeft, box, horiLineRight, horiLayoutReverse } =
  style;

interface IHorizontalLayoutProps {
  reverse?: boolean;
}

const HorizontalLayout = ({ reverse }: IHorizontalLayoutProps) => {
  return (
    <div
      className={
        reverse ? `${horiLayout} ${horiLayoutReverse}` : `${horiLayout}`
      }
    >
      <div className={horiLineLeft} />
      <div className={box} />
      <div className={horiLineRight} />
    </div>
  );
};

export default HorizontalLayout;
