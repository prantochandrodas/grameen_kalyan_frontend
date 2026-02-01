'use client';

import React from 'react';

import style from './detailSection.module.scss';
import { Button } from '@/shared/components';
import { IDetailSectionData } from './DetailSection.types';

const { detailSection, contentContainer, btnContainer } = style;

interface IDetailSectionProps {
  data: IDetailSectionData;
}

const DetailSection = ({ data }: IDetailSectionProps) => {
  return (
    <div className={detailSection}>
      <div
        className={contentContainer}
        dangerouslySetInnerHTML={{ __html: data.description }}
      ></div>
      <div className={btnContainer}>
        <Button text="Back" url={`/stories/${data.id}`} btnSecondary />
      </div>
    </div>
  );
};

export default DetailSection;
