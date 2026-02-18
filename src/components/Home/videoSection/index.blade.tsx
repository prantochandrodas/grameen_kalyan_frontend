'use client';

import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import style from './VideoSection.module.scss';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Arrow } from '@/shared/components'; // optional custom arrows

const { section, videoContainer, videoItem, iframeBox } = style;

interface Video {
  id: number;
  video_link: string;
}

const VideoSection = () => {
  const [videos, setVideos] = useState<Video[]>([]);

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

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2, // desktop
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <Arrow type="next" />,
    prevArrow: <Arrow type="prev" />,
    responsive: [
      {
        breakpoint: 768, // mobile
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className={section}>
      <h3 style={{
        margin: '0 0 20px 0', fontSize: '40px', fontWeight: 'bold', textAlign: 'center', color: '#0B612D'

      }}>Our Stories</h3>
      <div
        style={{
          width: '100px',
          height: '4px',
          backgroundColor: '#0B612D',
          margin: '0 auto 30px',
          borderRadius: '2px',
        }}
      />
      <div className={videoContainer}>
        <Slider {...sliderSettings}>
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
    </section>
  );
};

export default VideoSection;
