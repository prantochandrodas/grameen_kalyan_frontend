'use client';

import React, { useEffect, useState } from 'react';
import style from './VideoSection.module.scss';
import { FaPlay } from 'react-icons/fa';

const {
  section,
  videoContainer,
  title,
  grid,
  card,
  thumbBox,
  playBtn,
  body,
  modal,
  iframeBox,
  overlay,
} = style;

interface Video {
  id: number;
  title: string;
  short_description: string;
  video_link: string;
  thumb_image: string;
}

const IMAGE_BASE_URL = 'https://admin-grameenkalyan.stitbd.app';

const VideoSection = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch('/api/recommended-videos'); // ✅ proxy
        const result = await res.json();

        console.log(result.data);
        setVideos(result.data);
      } catch (error) {
        console.error('Video fetch error:', error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <>
      <section className={section}>
        <div className={videoContainer}>
          <div className={grid}>
            {videos.map((video) => (
              <div
                key={video.id}
                className={card}
                onClick={() => setActiveVideo(video.video_link)}
              >
                <div className={thumbBox}>
                  <img
                    src={`${IMAGE_BASE_URL}${video.thumb_image}`}
                    alt={video.title}
                  />
                  <button className={playBtn}>
                    <FaPlay />
                  </button>
                </div>

                <div className={body}>
                  <h6>{video.title}</h6>
                  <p>
                    {video.short_description.length > 80
                      ? video.short_description.substring(0, 80) + '...'
                      : video.short_description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {activeVideo && (
        <div className={overlay} onClick={() => setActiveVideo(null)}>
          <div className={modal} onClick={(e) => e.stopPropagation()}>
            <div className={iframeBox}>
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo}`}
                allow="autoplay; encrypted-media"
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
