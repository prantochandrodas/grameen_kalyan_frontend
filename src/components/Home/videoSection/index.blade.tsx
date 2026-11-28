'use client';

import React, { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import style from './VideoSection.module.scss';
import useFetchLaravelData from '@/shared/hook/useFetchData/useFetchData';

const {
  section, wave, goldCurve, wrapper, leftCol, tag, heading, desc, viewAllBtn,
  sliderCol, navBtns, navBtn, navBtnNext, navBtnDisabled,
  videoItem, iframeBox, staticGrid, facade, playIcon,
} = style;

interface Video {
  id: number;
  video_link: string;
}

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronIcon = ({ flip }: { flip?: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ transform: flip ? 'rotate(180deg)' : undefined }}>
    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const getSlidesToShow = (itemCount: number, want: number) => Math.max(1, Math.min(want, itemCount));

// slick breakpoint er sathe mil rekhe: <=768 mobile, baki desktop
const getWantedSlides = () => {
  if (typeof window === 'undefined') return 2;
  return window.innerWidth <= 768 ? 1 : 2;
};

// thumbnail first, real YouTube player loads only after the visitor taps play
const YouTubeFacade = ({ id, title }: { id: string; title: string }) => {
  const [play, setPlay] = useState(false);

  if (play) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${id}?autoplay=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      className={facade}
      onClick={() => setPlay(true)}
      aria-label={`Play ${title}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
        alt=""
        loading="lazy"
        decoding="async"
      />
      <span className={playIcon} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
    </button>
  );
};

const VideoSection = ({ initialVideos }: { initialVideos?: Video[] }) => {
  const hasInitial = Array.isArray(initialVideos) && initialVideos.length > 0;
  const [videos, setVideos] = useState<Video[]>(
    hasInitial ? (initialVideos as Video[]) : []
  );
  const [mounted, setMounted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [wantedSlides, setWantedSlides] = useState(2);
  const sliderRef = useRef<Slider>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (hasInitial) return;
    const fetchVideos = async () => {
      const res = await useFetchLaravelData({ url: '/recommended-video-galleries' });
      if (res?.data) setVideos(res.data);
    };
    fetchVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const update = () => setWantedSlides(getWantedSlides());
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const getYouTubeId = (url: string) => {
    const regExp = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/]+)/;
    const match = url.match(regExp);
    return match ? match[1] : url;
  };

  const desktopSlides = getSlidesToShow(videos.length, 2);
  const mobileSlides = getSlidesToShow(videos.length, 1);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: desktopSlides,
    slidesToScroll: 2,
    arrows: false,
    afterChange: (index: number) => setCurrentSlide(index),
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: mobileSlides,
          slidesToScroll: 1,
          infinite: false,
        },
      },
    ],
  };

  if (!videos.length) return null;

  const visibleSlides = getSlidesToShow(videos.length, wantedSlides);
  const maxSlideIndex = Math.max(0, videos.length - visibleSlides);
  const showNav = videos.length > visibleSlides;
  const isPrevDisabled = currentSlide <= 0;
  const isNextDisabled = currentSlide >= maxSlideIndex;

  const cards = videos.map((video) => (
    <div key={video.id} className={videoItem}>
      <div className={iframeBox}>
        <YouTubeFacade id={getYouTubeId(video.video_link)} title={`Video ${video.id}`} />
      </div>
    </div>
  ));

  return (
    <section className={section}>
      {/* Shudhu curve-er green border line, kono fill nai */}
      <svg
        className={wave}
        viewBox="0 0 1600 110"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,60 C300,0 1300,110 1600,40"
          fill="none"
          stroke="#0F4A2C"
          strokeWidth="1.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Decorative gold curve, bottom-right */}
      <svg
        className={goldCurve}
        viewBox="0 0 300 200"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M300,200 L300,60 C220,20 120,140 0,200 Z" fill="#c3953d" />
      </svg>

      <div className={wrapper}>
        <div className={leftCol}>
          <span className={tag}>— VIDEOS</span>
          <h2 className={heading}>Our Stories</h2>
          <p className={desc}>
            Watch how we are making a difference in people&apos;s lives through
            healthcare.
          </p>
          <a href="/videos" className={viewAllBtn}>
            View All Videos <ArrowIcon />
          </a>
        </div>

        <div className={sliderCol}>
          {showNav && (
            <div className={navBtns}>
              <button
                type="button"
                className={`${navBtn} ${isPrevDisabled ? navBtnDisabled : ''}`}
                aria-label="Previous"
                onClick={() => sliderRef.current?.slickPrev()}
              >
                <ChevronIcon flip />
              </button>
              <button
                type="button"
                className={`${navBtn} ${navBtnNext} ${isNextDisabled ? navBtnDisabled : ''}`}
                aria-label="Next"
                onClick={() => sliderRef.current?.slickNext()}
              >
                <ChevronIcon />
              </button>
            </div>
          )}

          {mounted ? (
            <Slider ref={sliderRef} {...settings}>
              {cards}
            </Slider>
          ) : (
            <div className={staticGrid}>{cards}</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default VideoSection;