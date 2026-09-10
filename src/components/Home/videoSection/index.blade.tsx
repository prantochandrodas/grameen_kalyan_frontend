'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Slider from 'react-slick';
import style from './VideoSection.module.scss';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Arrow } from '@/shared/components'; // optional custom arrows
import { motion } from 'framer-motion';
import useFetchLaravelData from '@/shared/hook/useFetchData/useFetchData';
const { section, videoContainer, videoItem, iframeBox, heading } = style;

interface Video {
  id: number;
  video_link: string;
}

const VideoSection = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  // Fetch videos
  useEffect(() => {
    const fetchVideos = async () => {
      const res = await useFetchLaravelData({ url: '/recommended-video-galleries' });
      if (res?.data) setVideos(res.data);
    };
    fetchVideos();
  }, []);

  // ✅ serial_no অনুযায়ী explicit sort, API order-এর উপর নির্ভর না করে
  const sortedVideos = useMemo(
    () => [...videos].sort((a, b) => Number(a.serial_no) - Number(b.serial_no)),
    [videos]
  );
  const getYouTubeId = (url: string) => {
    const regExp =
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/]+)/;
    const match = url.match(regExp);
    return match ? match[1] : url;
  };
  // Fetch videos
  useEffect(() => {
    const fetchVideos = async () => {
      const res = await useFetchLaravelData({ url: '/recommended-video-galleries' });
      if (res?.data) setVideos(res.data);
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

      <motion.h2
        initial={{ opacity: 0, bottom: '-10rem' }}
        whileInView={{ opacity: 1, bottom: '0' }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className={heading}
      >
        Our Stories
      </motion.h2>
      <div
        style={{
          width: '100px',
          height: '4px',
          backgroundColor: '#424744',
          margin: '0 auto 30px',
          borderRadius: '2px',
        }}
      />
      {/* <h3 style={{
        margin: '0 0 20px 0', fontSize: '50px', fontWeight: 'bold', textAlign: 'center', color: '#0B612D'

      }}>Our Stories</h3>
      <div
        style={{
          width: '100px',
          height: '4px',
          backgroundColor: '#0B612D',
          margin: '0 auto 30px',
          borderRadius: '2px',
        }}
      /> */}
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
