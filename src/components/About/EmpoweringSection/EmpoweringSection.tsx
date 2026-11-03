import React from 'react';

import { Reveal, RevealText } from '../Motion';

import style from './empoweringSection.module.scss';
import { IEmpoweringSectionProps } from './EmpoweringSection.types';

const {
  empoweringSection,
  container,
  intro,
  eyebrow,
  heading,
  highlight,
  accent,
  body,
  paragraphsContainer,
} = style;

const EmpoweringSection = ({ empoweringData }: IEmpoweringSectionProps) => {
  const title = empoweringData?.title?.trim();
  const details = empoweringData?.details?.trim();

  if (!title && !details) return null;

  // "… Since 1996" -> green first line + gold second line (falls back to one line)
  const titleMatch = title?.match(/^(.*?)\s*(Since\s+\d{4})$/i);
  const titleLines = titleMatch?.[1]
    ? [
        { text: titleMatch[1] },
        { text: titleMatch[2], className: highlight },
      ]
    : [{ text: title ?? '' }];

  return (
    <section className={empoweringSection}>
      <div className={container}>
        <div className={intro}>
          <RevealText
            as="h2"
            className={heading}
            lines={titleLines}
            stagger={0.05}
          />
          <Reveal
            className={accent}
            direction="right"
            distance={40}
            delay={0.3}
          />
        </div>

        <Reveal className={body} delay={0.15} distance={44}>
          <div
            className={paragraphsContainer}
            dangerouslySetInnerHTML={{ __html: details ?? '' }}
          />
        </Reveal>
      </div>
    </section>
  );
};

export default EmpoweringSection;