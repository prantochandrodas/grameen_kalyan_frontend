import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { IServiceSectionData } from '@/shared/types/ServiceSection';

import { ImageReveal, Reveal, RevealGroup, RevealItem } from '../Motion';
import { toAbsoluteImageUrl, asArray } from '../Shared/aboutHelpers';
import {
  ArrowRightIcon,
  ShieldIcon,
  StethoscopeIcon,
  UsersIcon,
} from '../Shared/icons';

import style from './impactAreas.module.scss';

const {
  impact,
  decor,
  glow,
  dots,
  container,
  intro,
  eyebrow,
  statement,
  highlight,
  moreLink,
  list,
  item,
  card,
  inner,
  photo,
  placeholder,
  badge,
  foot,
  title,
  arrow,
} = style;

interface IImpactAreasProps {
  serviceData?: IServiceSectionData[];
}

type Tone = 'green' | 'gold';

const ICONS: Record<string, React.ElementType> = {
  Healthcare: StethoscopeIcon,
  'Well-Being': UsersIcon,
  'Emergency Response': ShieldIcon,
  'Social Business': UsersIcon,
};

// Same links as the navbar: Healthcare has its own page, the rest open by id.
const getHref = (data: IServiceSectionData) =>
  data.title === 'Healthcare' ? '/healthcare' : `/services/${data.id}`;

const ImpactAreas = ({ serviceData }: IImpactAreasProps) => {
  const services = asArray<IServiceSectionData>(serviceData);

  return (
    <section className={impact} aria-labelledby="impact-areas-title">
      <div className={decor} aria-hidden="true">
        <span className={glow} />
        <span className={dots} />
      </div>

      <div className={container}>
        {/* ---------- Left: statement + button ---------- */}
        <div className={intro}>

          <Reveal as="h2" className={statement} delay={0.1}>
            <span id="impact-areas-title">
              Millions of People at{' '}
              <span className={highlight}>Bottom of the Pyramid</span> are
              Served with Empathy and Care
            </span>
          </Reveal>

          <Reveal delay={0.2}>
            <Link href="/services" className={moreLink}>
              Read More
              <ArrowRightIcon />
            </Link>
          </Reveal>
        </div>

        {/* ---------- Right: cards ---------- */}
        {services.length > 0 && (
          <RevealGroup as="ul" className={list} stagger={0.12}>
            {services.map((data, index) => {
              const Icon = ICONS[data.title] ?? StethoscopeIcon;
              // 1st & 3rd green, 2nd & 4th gold
              const tone: Tone = index % 2 === 0 ? 'green' : 'gold';
              const imgSrc = toAbsoluteImageUrl(data.homepage_thumb_image);

              return (
                <RevealItem
                  as="li"
                  className={item}
                  key={data.id ?? index}
                  distance={48}
                >
                  <Link
                    href={getHref(data)}
                    data-tone={tone}
                    aria-label={`Open ${data.title}`}
                    className={card}
                  >
                    <span className={inner}>
                      <ImageReveal className={photo} delay={index * 0.08}>
                        {imgSrc ? (
                          <Image
                            src={imgSrc}
                            alt={data.title}
                            fill
                            sizes="(max-width: 639px) 76vw, (max-width: 1099px) 45vw, 20vw"
                            style={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <span className={placeholder} />
                        )}
                      </ImageReveal>

                      <span className={badge}>
                        <Icon />
                      </span>

                      <span className={foot}>
                        <span className={title}>{data.title}</span>
                        <span className={arrow}>
                          <ArrowRightIcon />
                        </span>
                      </span>
                    </span>
                  </Link>
                </RevealItem>
              );
            })}
          </RevealGroup>
        )}
      </div>
    </section>
  );
};

export default ImpactAreas;