import React from 'react';

import style from './missionVision.module.scss';

const {
  missionVision,
  intro,
  heading,
  subText,
  cards,
  card,
  iconWrap,
  cardTitle,
  cardText,
  line,
} = style;

interface IMissionVisionProps {
  mission: string;
  vision: string;
}

const EyeIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const TargetIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const MissionVision = ({ mission, vision }: IMissionVisionProps) => {
  return (
    <section className={missionVision}>
      <div className={intro}>
        <h2 className={heading}>Our Vision  &amp; Mission</h2>
        <p className={subText}>
          Our vision and mission drive everything we do –
          from community health to sustainable development.
        </p>
      </div>

      <div className={cards}>
        <div className={card}>
          <div className={iconWrap}>
            <EyeIcon />
          </div>
          <h3 className={cardTitle}>Vision</h3>
          <p className={cardText}>{vision}</p>
          <span className={line} />
        </div>

        <div className={card}>
          <div className={iconWrap}>
            <TargetIcon />
          </div>
          <h3 className={cardTitle}>Mission</h3>
          <p className={cardText}>{mission}</p>
          <span className={line} />
        </div>
      </div>
    </section>
  );
};

export default MissionVision;