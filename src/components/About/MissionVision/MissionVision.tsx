import React from 'react';
import Image from 'next/image';

import layoutTL from '@/assets/layout/grid-top-leaf.svg';
import layoutRB from '@/assets/layout/grid-bottom-leaf.svg';

import style from './missionVision.module.scss';

const {
  missionVision,
  missionContainer,
  title,
  desc,
  visionContainer,
  layoutLeft,
  layoutRight,
  img,
} = style;

interface IMissionVisionProps {
  mission: string;
  vision: string;
}

const MissionVision = ({ mission, vision }: IMissionVisionProps) => {
  return (
    <div className={missionVision}>
      <div className={layoutLeft}>
        <Image className={img} src={layoutTL} alt="layout" />
      </div>
      <div className={layoutRight}>
        <Image className={img} src={layoutRB} alt="layout" />
      </div>
      <div className={visionContainer}>
        <h2 className={title}>vision</h2>
        <p className={desc}>{vision}</p>
      </div>
      <div className={missionContainer}>
        <h2 className={title}>mission</h2>
        <p className={desc}>{mission}</p>
      </div>
    </div>
  );
};

export default MissionVision;
