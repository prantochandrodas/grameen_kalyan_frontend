'use client';

import React from 'react';
import { MotionConfig } from 'framer-motion';

/** Honors the visitor's reduced-motion setting for every animation below it */
const MotionProvider = ({ children }: { children: React.ReactNode }) => (
  <MotionConfig reducedMotion="user">{children}</MotionConfig>
);

export default MotionProvider;