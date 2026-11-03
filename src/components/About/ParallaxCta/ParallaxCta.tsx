import React from 'react';
import Link from 'next/link';

import fallbackImage from '@/assets/images/lets-work.jpeg';

import { ParallaxImage, ParallaxLayer, Reveal, RevealText } from '../Motion';
import { toAbsoluteImageUrl } from '../Shared/aboutHelpers';
import { ArrowRightIcon } from '../Shared/icons';

import style from './parallaxCta.module.scss';

const {
  cta,
  glow,
  shell,
  media,
  mediaTint,
  panel,
  eyebrow,
  heading,
  highlight,
  parag,
  actions,
  button,
} = style;

interface IParallaxCtaProps {
  image?: string | null;
}

const ParallaxCta = ({ image }: IParallaxCtaProps) => {
  const src = toAbsoluteImageUrl(image) ?? fallbackImage;

  return (
    <section className={cta}>
      <ParallaxLayer className={glow} distance={80} reverse>
        <span />
      </ParallaxLayer>

      <div className={shell}>
        <Reveal className={media} distance={48} amount={0.1}>
          <ParallaxImage
            src={src}
            alt="Our team and partners working together"
            depth={0}
            position="center"
            sizes="(max-width: 1024px) 100vw, 66vw"
            className={media}
          >
            <span className={mediaTint} />
          </ParallaxImage>
        </Reveal>

        <Reveal className={panel} direction="left" distance={56} delay={0.15}>
          {/* <span className={eyebrow}>Partner With Us</span> */}
          <RevealText
            as="h2"
            className={heading}
            lines={[
              { text: 'Let’s Work' },
              { text: 'Together', className: highlight },
            ]}
          />

          <Reveal as="p" className={parag} delay={0.1} distance={20}>
            Our promise is that everyone at the Bottom of the Pyramid will have
            equal access to standard healthcare. We welcome partnerships and
            collaboration to build a better future together.
          </Reveal>

          <Reveal as="p" className={parag} delay={0.15} distance={20}>
            Reach out to learn more about partnership and collaboration
            opportunities.
          </Reveal>

          <Reveal className={actions} delay={0.2} distance={20}>
            <Link href="/join-us" className={button}>
              Join Us
              <ArrowRightIcon />
            </Link>
          </Reveal>
        </Reveal>
      </div>
    </section>
  );
};

export default ParallaxCta;