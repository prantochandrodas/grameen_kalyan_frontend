import React from 'react';

import { Reveal, RevealText } from '../Motion';

import style from './aboutUs.module.scss';

const {
  aboutUs,
  container,
  intro,
  eyebrow,
  heading,
  first,
  second,
  accent,
  body,
  description,
} = style;

interface IAboutUsProps {
  data: {
    heading: string;
    description: string;
  };
}

const AboutUs = ({ data }: IAboutUsProps) => {
  const headingString = data?.heading;
  const separator = '/'; // The separator between the two parts of the string

  // same splitting rules as before the redesign
  const partsArray = headingString?.split(separator);
  const headingFirstPart = partsArray?.shift();
  const headingSecondPart = partsArray?.pop();

  if (!headingFirstPart && !data?.description) return null;

  return (
    <section className={aboutUs}>
      <div className={container}>
        <div className={intro}>
          <RevealText
            as="h2"
            className={heading}
            lines={[
              { text: headingFirstPart ?? '', className: first },
              { text: headingSecondPart ?? '', className: second },
            ]}
          />
          <Reveal
            className={accent}
            direction="right"
            distance={40}
            delay={0.3}
          />
        </div>

        <Reveal className={body} delay={0.15} distance={40}>
          <div
            className={description}
            dangerouslySetInnerHTML={{ __html: data?.description ?? '' }}
          />
        </Reveal>
      </div>
    </section>
  );
};

export default AboutUs;