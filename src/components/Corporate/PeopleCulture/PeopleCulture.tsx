import React from 'react';
import Image from 'next/image';

import layoutLT from '@/assets/layout/grid-top-leaf.svg';
import layoutRB from '@/assets/layout/grid-bottom-leaf.svg';

import style from './peopleCulture.module.scss';

const { peopleCulture, heading, text, layoutLeft, layoutRight, img } = style;

const PeopleCulture = () => {
  return (
    <div className={peopleCulture}>
      <div className={layoutLeft}>
        <Image className={img} src={layoutLT} alt="layout" />
      </div>
      <div className={layoutRight}>
        <Image className={img} src={layoutRB} alt="layout" />
      </div>
      <h2 className={heading}>People & Culture</h2>
      <p className={text}>
        Human resource management is the strategic approach to the effective and
        efficient management of people in a company or organization such that
        they help their business gain a competitive advantage.
      </p>
      <p className={text}>
        The culture at Grameen Kalyan provides a strategic competitive
        advantage, beliefs and values widely shared and firmly upheld.
      </p>
      <p className={text}>
        With more effective implementation of quality improvement efforts and
        information systems development day by day, Kalyan provides better
        service and community-based primary healthcare across the country.
      </p>
      <p className={text}>
        We promote enhanced trust and cooperation, more efficient decisions,
        fewer disagreements, and focus on the organisation and its goals.
      </p>
      <p className={text}>
        With a strong sense of identification and a shared understanding of
        essential in Kalyan's goal, we want to serve people in the rural areas
        effectively and efficiently.
      </p>
    </div>
  );
};

export default PeopleCulture;
