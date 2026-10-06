import React from 'react';

import style from './sevenPrincipleCard.module.scss';

const {
  sevenPrincipleCard,
  serial,
  gold,
  iconBox,
  divider,
  content,
  title,
  description,
} = style;

type Props = {
  num: number;
  icon: React.ReactNode;
  title: string;
  desc?: string;
};

const SevenPrincipleCard = ({ num, icon, title: heading, desc }: Props) => {
  return (
    <div className={sevenPrincipleCard}>
      <span className={`${serial} ${num % 2 === 0 ? gold : ''}`}>{num}</span>
      <span className={iconBox}>{icon}</span>
      <span className={divider} />
      <div className={content}>
        <h3 className={title}>{heading}</h3>
        {desc && <p className={description}>{desc}</p>}
      </div>
    </div>
  );
};

export default SevenPrincipleCard;