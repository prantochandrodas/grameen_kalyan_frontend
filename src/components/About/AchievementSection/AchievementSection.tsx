'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';

import { IMAGE_BASE_URL } from '@/config';

import style from './achievementSection.module.scss';
import { IAchievementSection } from './AchievementSection.types';

const {
  achievementSection,
  journeyBlock,
  journeyHeader,
  journeyTitle,
  journeyAccent,
  trackScroller,
  rail,
  hexItem,
  hexItemActive,
  hexOuter,
  hexInner,
  hexPeriod,
  connector,
  connectorBox,
  sliderBlock,
  sliderViewport,
  sliderTrack,
  slide,
  imageContainer,
  img,
  contentContainer,
  heading,
  details,
  controls,
  arrowBtn,
  dots,
  dot,
  dotActive,
  journeyHighlight
} = style;

const AchievementSection = ({ achievementData }: IAchievementSection) => {
  const items = useMemo(
    () => [...(achievementData || [])].sort((a, b) => a.id - b.id),
    [achievementData]
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [pointerX, setPointerX] = useState<number | null>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const hexRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const touchStartX = useRef<number | null>(null);

  const lastIndex = items.length - 1;

  const goTo = useCallback(
    (index: number) => setActiveIndex(Math.min(Math.max(index, 0), lastIndex)),
    [lastIndex]
  );

  // active hexagon er majhkhane connector line boshabe (padding bad diye)
  const updatePointer = useCallback(() => {
    const wrapper = wrapperRef.current;
    const hex = hexRefs.current[activeIndex];
    if (!wrapper || !hex) return;

    const w = wrapper.getBoundingClientRect();
    const h = hex.getBoundingClientRect();
    const paddingLeft = parseFloat(getComputedStyle(wrapper).paddingLeft) || 0;

    setPointerX(h.left + h.width / 2 - w.left - paddingLeft);
  }, [activeIndex]);

  useEffect(() => {
    // chhoto screen e active hexagon ke scroller er majhkhane anbe
    const scroller = scrollerRef.current;
    const hex = hexRefs.current[activeIndex];
    if (scroller && hex && scroller.scrollWidth > scroller.clientWidth) {
      const left = hex.offsetLeft - (scroller.clientWidth - hex.clientWidth) / 2;
      scroller.scrollTo({ left, behavior: 'smooth' });
    }
    updatePointer();
  }, [activeIndex, updatePointer]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    window.addEventListener('resize', updatePointer);
    scroller?.addEventListener('scroll', updatePointer, { passive: true });
    return () => {
      window.removeEventListener('resize', updatePointer);
      scroller?.removeEventListener('scroll', updatePointer);
    };
  }, [updatePointer]);

  if (!items.length) return null;

  // mobile swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 50) goTo(activeIndex + (diff < 0 ? 1 : -1));
    touchStartX.current = null;
  };

  return (
    <div className={achievementSection} ref={wrapperRef}>
      {/* ================= Top: Our Journey (hexagon timeline) ================= */}
      <div className={journeyBlock}>
        <div className={journeyHeader}>
          <h2 className={journeyTitle}>
            Our <span className={journeyHighlight}>Journey</span>
          </h2>

          <span className={journeyAccent} aria-hidden="true" />
        </div>

        <div className={trackScroller} ref={scrollerRef}>
          <div className={rail}>
            {items.map((data, index) => (
              <button
                key={data.id}
                type="button"
                ref={(el) => {
                  hexRefs.current[index] = el;
                }}
                className={`${hexItem} ${index === activeIndex ? hexItemActive : ''}`}
                onMouseEnter={() => goTo(index)}
                onFocus={() => goTo(index)}
                onClick={() => goTo(index)}
                aria-label={data.title}
                aria-pressed={index === activeIndex}
              >
                <span className={hexOuter}>
                  <span className={hexInner}>
                    <Image
                      src={IMAGE_BASE_URL + data.thumb_image}
                      alt={data.title}
                      width={200}
                      height={200}
                    />
                  </span>
                </span>
                <span className={hexPeriod}>{data.title}</span>
                <span className={hexPeriod}>{data.subtitle}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ================= Connector: active hexagon -> slider ================= */}
      {pointerX !== null && (
        <div className={connector} style={{ left: pointerX }}>
          <span className={connectorBox} />
        </div>
      )}

      {/* ================= Bottom: Slider ================= */}
      <div className={sliderBlock}>
        <div
          className={sliderViewport}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div
            className={sliderTrack}
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {items.map((data, index) => (
              <div
                key={data.id}
                className={slide}
                aria-hidden={index !== activeIndex}
              >
                <div className={imageContainer}>
                  <Image
                    className={img}
                    src={IMAGE_BASE_URL + data.thumb_image}
                    alt={data.title}
                    width={500}
                    height={500}
                    priority={index === 0}
                  />
                </div>
                <div className={contentContainer}>
                  <h3 className={heading}>{data.title}</h3>
                  <div
                    className={details}
                    dangerouslySetInnerHTML={{ __html: data.details }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={controls}>
          <button
            type="button"
            className={arrowBtn}
            onClick={() => goTo(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-label="Previous period"
          >
            &#8249;
          </button>

          <div className={dots}>
            {items.map((data, index) => (
              <button
                key={data.id}
                type="button"
                className={`${dot} ${index === activeIndex ? dotActive : ''}`}
                onClick={() => goTo(index)}
                aria-label={`Go to ${data.title}`}
              />
            ))}
          </div>

          <button
            type="button"
            className={arrowBtn}
            onClick={() => goTo(activeIndex + 1)}
            disabled={activeIndex === lastIndex}
            aria-label="Next period"
          >
            &#8250;
          </button>
        </div>
      </div>
    </div>
  );
};

export default AchievementSection;