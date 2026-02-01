import React from 'react';

export interface ISliderProps {
  infinite: boolean;
  slideShow: number;
  dots?: boolean;
  customDot?: string;
  autoPlay?: boolean;
  pauseOnHover?: boolean;
  slideToShowMob?: number;
  sliderToShowTab?: number;
  centerMode?: boolean;
  autoplaySpeed?: number;
  children: React.ReactNode;
  arrows?: boolean;
}
