import React from 'react';

import { Reveal, RevealGroup, RevealItem, RevealText } from '../Motion';
import { EyeIcon, TargetIcon } from '../Shared/icons';

import style from './missionVision.module.scss';

const {
  missionVision,
  glow,
  container,
  header,
  eyebrow,
  heading,
  subText,
  cards,
  card,
  cardDark,
  cardLight,
  cardTop,
  iconWrap,
  cardTitle,
  line,
  cardText,
} = style;

interface IMissionVisionProps {
  mission: string;
  vision: string;
}

const MissionVision = ({ mission, vision }: IMissionVisionProps) => {
  const missionText = mission?.trim();
  const visionText = vision?.trim();
  const hasMission = Boolean(missionText);
  const hasVision = Boolean(visionText);

  if (!hasMission && !hasVision) return null;

  return (
    <section id="vision" className={missionVision}>
      <span className={glow} aria-hidden="true" />

      <div className={container}>
        <header className={header}>
          <RevealText
            as="h2"
            className={heading}
            lines={[{ text: 'Our Mission & Vision' }]}
          />
          <Reveal as="p" className={subText} delay={0.15}>
            Our mission and vision drive everything we do – from community
            health to sustainable development.
          </Reveal>
        </header>

        <RevealGroup className={cards} stagger={0.18}>
          {hasMission && (
            <RevealItem className={`${card} ${cardLight}`}>
              <div className={cardTop}>
                <span className={iconWrap}>
                  <TargetIcon />
                </span>
                <h3 className={cardTitle}>Mission</h3>
              </div>
              <span className={line} />
                 <p className={cardText}>{missionText}</p>
            </RevealItem>
          )}

          {hasVision && (
            <RevealItem className={`${card} ${cardLight}`}>
              <div className={cardTop}>
                <span className={iconWrap}>
                  <EyeIcon />
                </span>
                <h3 className={cardTitle}>Vision</h3>
              </div>
              <span className={line} />
              <p className={cardText}>{visionText}</p>
            </RevealItem>
          )}
        </RevealGroup>
      </div>
    </section>
  );
};

export default MissionVision;