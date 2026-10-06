import React from 'react';
import Image from 'next/image';

import sevenPrincipleImage from '@/assets/images/home/seven-principle.png';
import SevenPrincipleCard from './SevenPrincipleCard/SevenPrincipleCard';
import {
  TargetIcon,
  CoinsIcon,
  InvestorIcon,
  GrowthIcon,
  TeamIcon,
  WorkerIcon,
  JoyIcon,
} from './SevenPrincipleIcons';

import style from './sevenPrinciple.module.scss';

const {
  sevenPrinciple,
  header,
  eyebrow,
  heading,
  highlight,
  subtitle,
  body,
  noteWrap,
  blob,
  note,
  img,
  list,
} = style;

const sevenPrinciples = [
  {
    number: 1,
    icon: <TargetIcon />,
    title: 'Business objective',
    description:
      'To overcome poverty, or one or more problems (such as education, health, technology access, and environment) which threaten people and society; not profit maximization.',
  },
  {
    number: 2,
    icon: <CoinsIcon />,
    title: 'Financial and economic sustainability.',
  },
  {
    number: 3,
    icon: <InvestorIcon />,
    title: 'Investors get back',
    description:
      'Investors get back their investment amount only. No dividend is given beyond investment money.',
  },
  {
    number: 4,
    icon: <GrowthIcon />,
    title: 'When investment amount is paid back',
    description:
      'Company profit stays with the company for expansion and improvement.',
  },
  {
    number: 5,
    icon: <TeamIcon />,
    title: 'Gender sensitive and environmentally conscious.',
  },
  {
    number: 6,
    icon: <WorkerIcon />,
    title: 'Workforce get market wage',
    description: 'Workforce gets market wage with better working conditions.',
  },
  {
    number: 7,
    icon: <JoyIcon />,
    title: 'Do it with joy.',
  },
];

const SevenPrinciple = () => {
  return (
    <section className={sevenPrinciple}>
      <div className={header}>
        <span className={eyebrow}>7 Principles</span>
        <h2 className={heading}>
          7 Principles of <span className={highlight}>Social Business</span>
        </h2>
        <p className={subtitle}>
          Guiding our work towards a more equitable and self-reliant society.
        </p>
      </div>

      <div className={body}>
        <div className={noteWrap}>
          <div className={blob} />
          <div className={note}>
            <Image
              className={img}
              src={sevenPrincipleImage}
              width={1000}
              height={1000}
              alt="seven principle"
            />
          </div>
        </div>

        <div className={list}>
          {sevenPrinciples.map((data) => (
            <SevenPrincipleCard
              key={data.number}
              num={data.number}
              icon={data.icon}
              title={data.title}
              desc={data.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SevenPrinciple;