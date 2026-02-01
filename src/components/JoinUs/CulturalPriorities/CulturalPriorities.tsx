import React from 'react';

import CulturalPrioritiesCard from '../CulturalPrioritiesCard/CulturalPrioritiesCard';
import culturalPrioritiesData from '@/assets/data/culturalPrioritiesData';

import style from './culturalPriorities.module.scss';

const { culturalPriorities, heading } = style;

const CulturalPriorities = () => {
  return (
    <div className={culturalPriorities}>
      <h2 className={heading}>
        Grameen Kalyan goes out of its way to harmonize cultural priorities &
        values to the employees and health force
      </h2>
      {culturalPrioritiesData.map((data) => {
        if (Number(data.number) % 2 === 0) {
          return (
            <CulturalPrioritiesCard key={data.number} data={data} reverse />
          );
        }
        return <CulturalPrioritiesCard key={data.number} data={data} />;
      })}
    </div>
  );
};

export default CulturalPriorities;
