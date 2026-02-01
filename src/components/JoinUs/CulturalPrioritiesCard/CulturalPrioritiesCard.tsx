import React from 'react';

import style from './culturalPrioritiesCard.module.scss';
import { ICulturalPrioritiesCard } from './CulturalPrioritiesCard.type';

const {
  culturalPrioritiesCard,
  numberBox,
  number,
  text,
  culturalPrioritiesCardReverse,
  numberBoxReverse,
} = style;

interface ICulturalPrioritiesCardProps {
  data: ICulturalPrioritiesCard;
  reverse?: boolean;
}

const CulturalPrioritiesCard = ({
  reverse,
  data,
}: ICulturalPrioritiesCardProps) => {
  const num = Number(data.number);

  return (
    <div
      className={
        reverse
          ? `${culturalPrioritiesCard} ${culturalPrioritiesCardReverse}`
          : `${culturalPrioritiesCard}`
      }
    >
      <p className={text}>{data.description}</p>
      <div
        className={
          reverse ? `${numberBox} ${numberBoxReverse}` : `${numberBox}`
        }
      >
        <h3 className={number}>{num}</h3>
      </div>
    </div>
  );
};

export default CulturalPrioritiesCard;
