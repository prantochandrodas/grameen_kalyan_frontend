import React from 'react';

import CategoryShowcase from '@/shared/components/CategoryShowcase/CategoryShowcase';
import { IMedicalCareListProps } from './MedicalCare.types';

import style from './medicalCareList.module.scss';

const { medicalCareList } = style;

const MedicalCareList = ({ medicalCareCategory }: IMedicalCareListProps) => {
  const showcaseData = medicalCareCategory?.map((category) => ({
    ...category,
    dataType: (category as { dataType?: string }).dataType ?? 'medical',
  }));

  return (
    <div className={medicalCareList}>
      <CategoryShowcase data={showcaseData} primary />
    </div>
  );
};

export default MedicalCareList;