'use client';

import React from 'react';

import style from './detailSection.module.scss';
import { Button } from '@/shared/components';

const { detailSection, contentContainer, btnContainer } = style;

interface IDetailSectionProps {
  detail: string;
}

const DetailSection = ({ detail }: IDetailSectionProps) => {
  return (
    <div className={detailSection}>
      <div
        className={contentContainer}
        dangerouslySetInnerHTML={{ __html: detail }}
      ></div>
      <div className={btnContainer}>
        <Button text="Back" url="/services" btnSecondary />
      </div>
    </div>
  );
};

export default DetailSection;
