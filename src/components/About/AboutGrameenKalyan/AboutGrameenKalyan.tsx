import React from 'react';

import { Reveal } from '../Motion';

import style from './aboutGrameenKalyan.module.scss';

const { aboutGrameenKalyan, card, rule, content } = style;

interface IAboutGrameenKalyanProps {
  aboutGkData: string;
}

const AboutGrameenKalyan = ({ aboutGkData }: IAboutGrameenKalyanProps) => {
  if (!aboutGkData || typeof aboutGkData !== 'string') return null;

  return (
    <section className={aboutGrameenKalyan}>
      <Reveal className={card} distance={48} amount={0.08}>
        <span className={rule} aria-hidden="true" />
        <div
          className={content}
          dangerouslySetInnerHTML={{ __html: aboutGkData }}
        />
      </Reveal>
    </section>
  );
};

export default AboutGrameenKalyan;