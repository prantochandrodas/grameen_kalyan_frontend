'use client';

import React from 'react';

import { Button } from '@/shared/components';

import style from './detailSection.module.scss';

const { detailSection, contentBox, cornerAccent, contentContainer, btnContainer } =
  style;

interface IDetailSectionProps {
  detail: string;
}

const DetailSection = ({ detail }: IDetailSectionProps) => {
  return (
    <div className={detailSection}>
      {detail ? (
        <div className={contentBox}>
          <span className={cornerAccent} />
          <div
            className={contentContainer}
            dangerouslySetInnerHTML={{ __html: detail }}
          />
        </div>
      ) : null}

      <div className={btnContainer}>
        <Button text="Back" url="/healthcare" btnSecondary />
      </div>
    </div>
  );
};

export default DetailSection;