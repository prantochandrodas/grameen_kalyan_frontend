import React from 'react';

import style from './sevenPrincipleCard.module.scss';

const { sevenPrincipleCard, serial, description } = style;

const SevenPrincipleCard = ({ num, desc }: { num: number; desc: string }) => {
  return (
    <div className={sevenPrincipleCard}>
      <h2 className={serial}>{num}</h2>
      <p className={description}>{desc}</p>
    </div>
  );
};

export default SevenPrincipleCard;
