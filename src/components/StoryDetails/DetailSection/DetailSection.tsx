'use client';

import React, { useMemo } from 'react';

import { Button } from '@/shared/components';

import style from './detailSection.module.scss';
import { IDetailSectionData } from './DetailSection.types';

const {
  detailSection,
  contentBox,
  cornerAccent,
  contentContainer,
  empty,
  btnContainer,
} = style;

interface IDetailSectionProps {
  data: IDetailSectionData;
}

// wrap every editor <table> so wide tables scroll sideways on phones
const wrapTables = (html = '') =>
  html
    .replace(/<table/gi, '<div class="gk-table-wrap"><table')
    .replace(/<\/table>/gi, '</table></div>');

const DetailSection = ({ data }: IDetailSectionProps) => {
  const html = useMemo(() => wrapTables(data?.description), [data?.description]);

  return (
    <section className={detailSection}>
      {html ? (
        <div className={contentBox}>
          <span className={cornerAccent} />
          <div
            className={contentContainer}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      ) : (
        <p className={empty}>Details will be available soon.</p>
      )}

      <div className={btnContainer}>
        <Button text="Back" url={`/stories/${data.id}`} btnSecondary />
      </div>
    </section>
  );
};

export default DetailSection;