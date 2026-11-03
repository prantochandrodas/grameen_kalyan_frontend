import React from 'react';

import {
  CountUp,
  ParallaxImage,
  Reveal,
  RevealGroup,
  RevealItem,
  RevealText,
} from '../Motion';
import { asArray } from '../Shared/aboutHelpers';

import style from './ourProudSection.module.scss';
import { IOurProudSection } from './ourProudSection.type';

const bgImage =
  'https://res.cloudinary.com/dboyf6lad/image/upload/v1692613875/proud-bg_bu0agc.jpg';

const {
  annualSection,
  bgContainer,
  overlay,
  inner,
  header,
  heading,
  subHeading,
  bar,
  gridContainer,
  card,
  number,
  title,
} = style;

const OurProudSection = ({
  proudPresenceData,
  headingText,
  subHeadingText,
}: IOurProudSection) => {
  const stats =
    asArray<IOurProudSection['proudPresenceData'][number]>(proudPresenceData);

  return (
    <section className={annualSection}>
      <ParallaxImage
        className={bgContainer}
        src={bgImage}
        alt=""
        depth={18}
        position="center top"
        sizes="100vw"
      />
      <div className={overlay} />

      <div className={inner}>
        <div className={header}>
          <RevealText
            as="h2"
            className={heading}
            lines={[{ text: headingText }]}
          />
          <Reveal as="p" className={subHeading} delay={0.2} distance={20}>
            {subHeadingText}
          </Reveal>
          <Reveal className={bar} direction="none" delay={0.35} />
        </div>

        <RevealGroup className={gridContainer} stagger={0.12} amount={0.2}>
          {stats.map((data) => (
            <RevealItem className={card} key={data.id} distance={44}>
              <span className={number}>
                <CountUp value={data.value} duration={1.8} />
              </span>
              <span className={title}>{data.title}</span>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
};

export default OurProudSection;