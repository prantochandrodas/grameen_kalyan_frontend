'use client';

import { usePathname } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  X,
} from 'lucide-react';

import styles from './OpeningPopup.module.scss';

type Promotion = {
  id: number;
  image: string;
};

type PopupApiItem = {
  id: number;
  serial_no?: string | number;
  image?: string;
};

const POPUP_API_URL = 'https://admin.grameenkalyan.com/api/popup-images';
const dismissalStorageKey = 'opening-popup-dismissed';

const OpeningPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const hasMultiplePromotions = promotions.length > 1;
  const touchStartX = useRef<number | null>(null);
  const pathname = usePathname();
  const dialogRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsOpen(false);
    if (pathname !== '/' || window.sessionStorage.getItem(dismissalStorageKey)) {
      return undefined;
    }

    const controller = new AbortController();
    const preloader = new window.Image();
    let timeout: number | undefined;

    const loadPromotions = async () => {
      try {
        const response = await fetch(POPUP_API_URL, { signal: controller.signal });
        if (!response.ok) return;

        const result = await response.json();
        const items: Promotion[] = (Array.isArray(result?.data) ? (result.data as PopupApiItem[]) : [])
          .filter((item) => Boolean(item?.image))
          .sort((a, b) => Number(a.serial_no ?? 0) - Number(b.serial_no ?? 0))
          .map((item) => ({ id: item.id, image: item.image as string }));

        if (!items.length) return;

        // Open only after the first image is fully loaded (no blank popup)
        preloader.onload = () => {
          setPromotions(items);
          setActiveSlide(0);
          items.slice(1).forEach((item) => {
            const img = new window.Image();
            img.src = item.image;
          });
          timeout = window.setTimeout(() => setIsOpen(true), 800);
        };
        preloader.src = items[0].image;
      } catch {
        // API error or aborted: popup stays hidden
      }
    };

    loadPromotions();

    return () => {
      controller.abort();
      preloader.onload = null;
      if (timeout) window.clearTimeout(timeout);
    };
  }, [pathname]);

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
  }, [isOpen, isPaused, hasMultiplePromotions, promotions.length]);

  if (!isOpen || promotions.length === 0) return null;

  const closePopup = () => {
    window.sessionStorage.setItem(dismissalStorageKey, 'true');
    setIsOpen(false);
  };

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

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null || !hasMultiplePromotions) return;

    const distance = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(distance) < 40) return;

    if (distance > 0) {
      showPreviousSlide();
    } else {
      showNextSlide();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') {
      closePopup();
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
        if (event.target === event.currentTarget) closePopup();
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
          onClick={closePopup}
          aria-label="Close promotions"
        >
          <X aria-hidden="true" />
        </button>

        <div
          className={styles.imageFrame}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={promotions[activeSlide].id}
            className={styles.promotionImage}
            src={promotions[activeSlide].image}
            alt={`Featured health promotion ${activeSlide + 1} of ${promotions.length}`}
            draggable={false}
            decoding="async"
            onError={() => {
              setPromotions((current) => current.filter((_, index) => index !== activeSlide));
              setActiveSlide(0);
            }}
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
