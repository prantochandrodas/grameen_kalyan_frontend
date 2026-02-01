'use client';

import React from 'react';

import style from './aboutGrameenKalyan.module.scss';

const { aboutGrameenKalyan } = style;

interface IAboutGrameenKalyanProps {
  aboutGkData: string;
}

const AboutGrameenKalyan = ({ aboutGkData }: IAboutGrameenKalyanProps) => {
  return (
    <div
      className={aboutGrameenKalyan}
      dangerouslySetInnerHTML={{ __html: aboutGkData }}
    ></div>
  );
};

export default AboutGrameenKalyan;
