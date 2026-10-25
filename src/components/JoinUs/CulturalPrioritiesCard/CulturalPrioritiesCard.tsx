import React from 'react';
import {
  FaHeartbeat,
  FaUsers,
  FaHandshake,
  FaHandHoldingHeart,
} from 'react-icons/fa';

import style from './culturalPrioritiesCard.module.scss';
import { ICulturalPrioritiesCard } from './CulturalPrioritiesCard.type';

const {
  culturalPrioritiesCard,
  numberBox,
  number,
  text,
  culturalPrioritiesCardReverse,
  numberBoxReverse,
  cardHeader,
  cardTitle,
} = style;

const icons = [FaHeartbeat, FaUsers, FaHandshake, FaHandHoldingHeart];

const titles = [
  'Quality Healthcare',
  'Safe & Healthy Communities',
  'Social Business',
  'Serving Rural Areas',
];

interface ICulturalPrioritiesCardProps {
  data: ICulturalPrioritiesCard;
  reverse?: boolean;
}

const CulturalPrioritiesCard = ({
  reverse,
  data,
}: ICulturalPrioritiesCardProps) => {
  const num = Number(data.number);
  const Icon = icons[Math.max(num - 1, 0) % icons.length];
  const title = data.title ?? titles[Math.max(num - 1, 0) % titles.length];

  return (
    <div
      className={
        reverse
          ? `${culturalPrioritiesCard} ${culturalPrioritiesCardReverse}`
          : `${culturalPrioritiesCard}`
      }
    >
      <div className={cardHeader}>
        <div
          aria-hidden="true"
          className={
            reverse ? `${numberBox} ${numberBoxReverse}` : `${numberBox}`
          }
        >
          <span className={number}>
            <Icon />
          </span>
        </div>
        <h3 className={cardTitle}>{title}</h3>
      </div>
      <p className={text}>{data.description}</p>
    </div>
  );
};

export default CulturalPrioritiesCard;
