'use client';

import React from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

const PhotoViewer = ({ children }: any) => {
  return <PhotoProvider>{children}</PhotoProvider>;
};

export default PhotoViewer;
