'use client';

import React, { useEffect, useState } from 'react';
import style from './VideoSection.module.scss';

const { section, videoContainer, grid, videoItem, iframeBox } = style;

interface Video {
  id: number;
  video_link: string;
}

const VideoSection = () => {
  const [videos, setVideos] = useState<Video[]>([]);

  // 🔹 YouTube ID extractor
  const getYouTubeId = (url: string) => {
    const regExp =
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/]+)/;
    const match = url.match(regExp);
    return match ? match[1] : url;
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch('/api/recommended-videos');
        const result = await res.json();
        setVideos(result.data || []);
      } catch (error) {
        console.error('Video fetch error:', error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <section className={section}>
      <div className={videoContainer}>
        <div className={grid}>
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
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
