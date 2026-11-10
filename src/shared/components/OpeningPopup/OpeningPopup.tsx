'use client';

import Image, { StaticImageData } from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  X,
} from 'lucide-react';

import popupOne from '@/assets/images/popup/01.jpg';
// import popupTwo from '@/assets/images/popup/02.jpg';
// import popupThree from '@/assets/images/popup/03.gif';
// import popupFour from '@/assets/images/popup/04.gif';
// import popupFive from '@/assets/images/popup/05.png';

import styles from './OpeningPopup.module.scss';

const promotions: StaticImageData[] = [
  popupOne,
  // popupTwo,
  // popupThree,
  // popupFour,
  // popupFive,
];

const hasMultiplePromotions = promotions.length > 1;

const OpeningPopup = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const dialogRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => {
      if (mediaQuery.matches) setIsPaused(true);
    };

    updatePreference();
    mediaQuery.addEventListener('change', updatePreference);

    return () => mediaQuery.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    if (!isOpen || isPaused || !hasMultiplePromotions) return undefined;

    const interval = window.setInterval(() => {
      setActiveSlide((currentSlide) => (currentSlide + 1) % promotions.length);
    }, 5500);

    return () => window.clearInterval(interval);
  }, [isOpen, isPaused]);

  if (!isOpen) return null;

  const showPreviousSlide = () => {
    if (!hasMultiplePromotions) return;
    setActiveSlide((currentSlide) => (currentSlide - 1 + promotions.length) % promotions.length);
    setIsPaused(true);
  };

  const showNextSlide = () => {
    if (!hasMultiplePromotions) return;
    setActiveSlide((currentSlide) => (currentSlide + 1) % promotions.length);
    setIsPaused(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
      return;
    }

    if (hasMultiplePromotions && event.key === 'ArrowLeft') {
      event.preventDefault();
      showPreviousSlide();
      return;
    }

    if (hasMultiplePromotions && event.key === 'ArrowRight') {
      event.preventDefault();
      showNextSlide();
      return;
    }

    if (event.key === 'Tab') {
      const focusableElements = dialogRef.current?.querySelectorAll<HTMLButtonElement>(
        'button:not(:disabled)'
      );
      if (!focusableElements?.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  };

  return (
    <div
      className={styles.backdrop}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) setIsOpen(false);
      }}
    >
      <section
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label="Featured promotions"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        <button
          ref={closeButtonRef}
          type="button"
          className={`${styles.iconButton} ${styles.closeButton}`}
          onClick={() => setIsOpen(false)}
          aria-label="Close promotions"
        >
          <X aria-hidden="true" />
        </button>

        <div className={styles.imageFrame}>
          <Image
            className={styles.promotionImage}
            src={promotions[activeSlide]}
            alt={`Featured health promotion ${activeSlide + 1} of ${promotions.length}`}
            width={promotions[activeSlide].width}
            height={promotions[activeSlide].height}
            priority
            unoptimized
          />

          {hasMultiplePromotions && (
            <>
              <button
                type="button"
                className={`${styles.iconButton} ${styles.previousButton}`}
                onClick={showPreviousSlide}
                aria-label="Previous promotion"
              >
                <ChevronLeft aria-hidden="true" />
              </button>
              <button
                type="button"
                className={`${styles.iconButton} ${styles.nextButton}`}
                onClick={showNextSlide}
                aria-label="Next promotion"
              >
                <ChevronRight aria-hidden="true" />
              </button>
            </>
          )}
        </div>

        {hasMultiplePromotions && (
          <div className={styles.controls}>
            <button
              type="button"
              className={`${styles.iconButton} ${styles.playButton}`}
              onClick={() => setIsPaused((paused) => !paused)}
              aria-label={isPaused ? 'Play slideshow' : 'Pause slideshow'}
            >
              {isPaused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
            </button>

            <div
              className={styles.pagination}
              role="group"
              aria-label="Choose a promotion"
            >
              {promotions.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={`${styles.dot} ${index === activeSlide ? styles.activeDot : ''}`}
                  onClick={() => {
                    setActiveSlide(index);
                    setIsPaused(true);
                  }}
                  aria-label={`Show promotion ${index + 1}`}
                  aria-current={index === activeSlide ? 'true' : undefined}
                />
              ))}
            </div>

            <span className={styles.slideCount} aria-live="polite">
              {activeSlide + 1} / {promotions.length}
            </span>
          </div>
        )}
      </section>
    </div>
  );
};

export default OpeningPopup;
