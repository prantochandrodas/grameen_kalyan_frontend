'use client';

import React, { useEffect, useState } from 'react';
import style from './VideoSection.module.scss';
import { FaPlay } from 'react-icons/fa';
import useFetchLaravelData from '@/shared/hook/useFetchData/useFetchData';

const {
  section,
  videoContainer,
  grid,
  card,
  thumbBox,
  playBtn,
  body,
  modal,
  iframeBox,
  overlay,
  closeBtn,
} = style;

interface Video {
  id: number;
  title: string;
  short_description: string;
  video_link: string; // YouTube video ID
  thumb_image: string;
}

const IMAGE_BASE_URL = 'https://admin.grameenkalyan.com';

const VideoSection = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  // Fetch videos
  useEffect(() => {
    const fetchVideos = async () => {
      const res = await useFetchLaravelData({ url: '/video-galleries' });
      if (res?.data) setVideos(res.data);
    };
    fetchVideos();
  }, []);

  // Close modal with Esc key + lock page scroll while modal is open
  useEffect(() => {
    if (!activeVideo) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveVideo(null);
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeVideo]);

  return (
    <>
      <section className={section}>
        <div className={videoContainer}>
          <div className={grid}>
            {videos.map((video: Video) => (
              <div
                key={video.id}
                className={card}
                role="button"
                tabIndex={0}
                aria-label={`Play video: ${video.title}`}
                onClick={() => setActiveVideo(video.video_link)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveVideo(video.video_link);
                  }
                }}
              >
                <div className={thumbBox}>
                  <img
                    src={`${IMAGE_BASE_URL}${video.thumb_image}`}
                    alt={video.title}
                    loading="lazy"
                  />
                  <span className={playBtn} aria-hidden="true">
                    <FaPlay />
                  </span>
                </div>

                <div className={body}>
                  <h6>{video.title}</h6>
                  <p>{video.short_description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {activeVideo && (
        <div
          className={overlay}
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveVideo(null)}
        >
          <div className={modal} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={closeBtn}
              aria-label="Close video"
              onClick={() => setActiveVideo(null)}
            >
              &times;
            </button>
            <div className={iframeBox}>
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0`}
                title="Video player"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoSection;