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
  title?: string;
  subtitle?: string;
  mission: string;
  vision: string;
}

const MissionVision = ({
  title,
  subtitle,
  mission,
  vision,
}: IMissionVisionProps) => {
  const missionText = mission?.trim();
  const visionText = vision?.trim();
  const titleText = title?.trim();
  const subtitleText = subtitle?.trim();
  const hasMission = Boolean(missionText);
  const hasVision = Boolean(visionText);

  if (!hasMission && !hasVision) return null;

  return (
    <section id="vision" className={missionVision}>
      <span className={glow} aria-hidden="true" />

      <div className={container}>
        <header className={header}>
          {titleText && (
            <RevealText
              as="h2"
              className={heading}
              lines={[{ text: titleText }]}
            />
          )}
          {subtitleText && (
            <Reveal as="p" className={subText} delay={0.15}>
              {subtitleText}
            </Reveal>
          )}
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