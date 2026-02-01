import React from 'react';
import Image from 'next/image';

import sevenPrincipleImage from '@/assets/images/home/seven-principle.png';
import SevenPrincipleCard from './SevenPrincipleCard/SevenPrincipleCard';

import style from './sevenPrinciple.module.scss';

const {
  sevenPrinciple,
  heading,
  imgContainer,
  img,
  contentContainer,
  divider,
} = style;

const sevenPrinciples = [
  {
    number: 1,
    description:
      'Business objective will be to overcome poverty, or one or more problems (such as education, health, technology access, and environment) which threaten people and society; not profit maximization.',
  },
  {
    number: 2,
    description: 'Financial and economic sustainability.',
  },
  {
    number: 3,
    description:
      'Investors get back their investment amount only. No dividend is given beyond investment money.',
  },
  {
    number: 4,
    description:
      'When investment amount is paid back, company profit stays with the company for expansion and improvement.',
  },
  {
    number: 5,
    description: 'Gender sensitive and environmentally conscious.',
  },
  {
    number: 6,
    description: 'Workforce gets market wage with better working conditions.',
  },
  {
    number: 7,
    description: 'Do it with joy.',
  },
];

const SevenPrinciple = () => {
  return (
    <div className={sevenPrinciple}>
      <h2 className={heading}>7 Principles of Social Business</h2>
      <div className={imgContainer}>
        <Image
          className={img}
          src={sevenPrincipleImage}
          width={1000}
          height={1000}
          alt="seven principle"
        />
      </div>
      <div className={divider} />
      <div className={contentContainer}>
        {sevenPrinciples.map((data, index) => (
          <div key={index}>
            <SevenPrincipleCard num={data.number} desc={data.description} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SevenPrinciple;
