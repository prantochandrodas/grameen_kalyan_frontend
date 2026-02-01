import React from 'react';

import { IMedicalCareListProps } from './MedicalCare.types';
import { ImageDisplay } from '@/shared/components/ImageDisplay';

import style from './medicalCareList.module.scss';

const { medicalCareList } = style;

const MedicalCareList = ({ medicalCareCategory }: IMedicalCareListProps) => {
  return (
    <div className={medicalCareList}>
      <ImageDisplay data={medicalCareCategory} primary />
    </div>
  );
};

export default MedicalCareList;
