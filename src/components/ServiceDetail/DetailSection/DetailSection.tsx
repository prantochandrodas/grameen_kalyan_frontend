'use client';

import React from 'react';

import style from './detailSection.module.scss';

const { detailSection, contentBox, cornerAccent, contentContainer } = style;

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
    </div>
  );
};

export default DetailSection;
