'use client';

import React, { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import style from './VideoSection.module.scss';
import useFetchLaravelData from '@/shared/hook/useFetchData/useFetchData';

const {
  section, wave, leaf, goldCurve, wrapper, leftCol, tag, heading, desc, viewAllBtn,
  sliderCol, navBtns, navBtn, navBtnNext, navBtnDisabled,
  videoItem, iframeBox,
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

const VideoSection = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<Slider>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await useFetchLaravelData({ url: '/recommended-video-galleries' });
      if (res?.data) setVideos(res.data);
    };
    fetchVideos();
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
    infinite: videos.length > desktopSlides,
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
          infinite: videos.length > mobileSlides,
        },
      },
    ],
  };

  if (!videos.length) return null;

  const showNav = videos.length > 1;
  const maxSlideIndex = videos.length - desktopSlides;
  const isPrevDisabled = !settings.infinite && currentSlide <= 0;
  const isNextDisabled = !settings.infinite && currentSlide >= maxSlideIndex;

  return (
    <section className={section}>
      {/* Wave transition from previous (light) section into this dark green section */}
      <svg
        className={wave}
        viewBox="0 0 1600 110"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,0 L1600,0 L1600,40 C1300,110 300,0 0,60 Z"
          fill="currentColor"
        />
      </svg>

      {/* Decorative gold curve, bottom-right */}
      <svg
        className={goldCurve}
        viewBox="0 0 300 200"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M300,200 L300,60 C220,20 120,140 0,200 Z" fill="#e0a132" />
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

          <Slider ref={sliderRef} {...settings}>
            {videos.map((video) => (
              <div key={video.id} className={videoItem}>
                <div className={iframeBox}>
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeId(video.video_link)}`}
                    title={`Video ${video.id}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;