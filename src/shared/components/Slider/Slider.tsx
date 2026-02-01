'use client';

import React from 'react';
import Slider, { Settings as SliderSettings } from 'react-slick';

import { ISliderProps } from './Slider.types';
import './slider.scss';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Arrow } from '../Arrow';

const Sliders = ({
  infinite,
  slideShow,
  dots,
  customDot,
  autoPlay,
  pauseOnHover = true,
  slideToShowMob = 2,
  sliderToShowTab = 1,
  centerMode = true,
  autoplaySpeed = 2000,
  children,
  arrows = false,
}: ISliderProps) => {
  // const {
  //   sliderBox, circleDot, flatDot, slickMain
  // } = style;

  const sliderSettings: SliderSettings = {
    dots: dots,
    infinite: infinite,
    speed: 500,
    slidesToShow: slideShow,
    slidesToScroll: 1,
    centerMode: false,
    centerPadding: '0', // added to remove extra padding on both side of the slider
    arrows: arrows,
    prevArrow: <Arrow type="prev" />,
    nextArrow: <Arrow type="next" />,
    cssEase: 'ease-in-out',
    className: 'slickMain',
    autoplay: autoPlay,
    autoplaySpeed: autoplaySpeed,
    dotsClass: `slick-dots ${customDot === 'circle' ? 'circleDot' : customDot === 'flat' ? 'flatDot' : ''}`,
    pauseOnHover: pauseOnHover,
    responsive: [
      {
        breakpoint: 1025,
        settings: {
          centerMode: centerMode,
          slidesToShow: sliderToShowTab,
        },
      },
      {
        breakpoint: 640,
        settings: {
          centerMode: centerMode,
          slidesToShow: slideToShowMob,
        },
      },
    ],
  };

  return (
    <div className="sliderBox">
      <Slider {...sliderSettings}>{children}</Slider>
    </div>
  );
};

export default Sliders;
