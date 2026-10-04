import React from 'react';
import Image from 'next/image';
import { FaLeaf } from 'react-icons/fa';

import CategoryShowcase from '@/shared/components/CategoryShowcase/CategoryShowcase';
import { ICategory } from '@/shared/types/category';
import layoutL from '@/assets/layout/healthcare/GK_website_OPT_01_Healthcare-04.svg';
import layoutR from '@/assets/layout/healthcare/GK_website_OPT_01_Locator-04.svg';

import style from './medicalCare.module.scss';

const {
  page,
  medicalSection,
  eyebrow,
  eyebrowLine,
  heading,
  highlight,
  parag,
  divider,
  dividerLine,
  dividerIcon,
  showcaseWrap,
  layoutLeft,
  layoutRight,
  img,
} = style;

interface IMedicalCareProps {
  medicalCareCategory: ICategory[];
}

const MedicalCare = ({ medicalCareCategory }: IMedicalCareProps) => {
  // Links need a dataType; default to "medical" when the API data has none.
  const showcaseData = medicalCareCategory?.map((category) => ({
    ...category,
    dataType: (category as { dataType?: string }).dataType ?? 'medical',
  }));

  return (
    <div className={page}>
      <div className={layoutLeft}>
        <Image className={img} src={layoutL} alt="" />
      </div>
      <div className={layoutRight}>
        <Image className={img} src={layoutR} alt="" />
      </div>

      <div className={medicalSection}>
        <p className={eyebrow}>
          <span className={eyebrowLine} />
          Primary Healthcare
          <span className={eyebrowLine} />
        </p>

        <h2 className={heading}>
          <span>Disease Specific</span>
          <span className={highlight}>Medical Care</span>
        </h2>

        <p className={parag}>
          To ensure comprehensive primary healthcare, our disease specific
          medical care lays on these areas, for patients to choose from
        </p>

        <div className={divider} aria-hidden="true">
          <span className={dividerLine} />
          <FaLeaf className={dividerIcon} />
          <span className={dividerLine} />
        </div>
      </div>

    </div>
  );
};

export default MedicalCare;