'use client';

import React from 'react';

import Gallery from '@/components/PhotoGallery/Gallery/Gallery';
import { useFetch } from '@/shared/hook';
import useFetchLaravelData from '@/shared/hook/useFetchData/useFetchData';

const GalleryPage = async ({ params }: { params: { id: number } }) => {
  const id = parseInt(params.id.toString());
  const galleryPhotos = await useFetchLaravelData({
    url: `/photo-galleries?category_id=${id}`,
  });
  // const galleryPhotos = await useFetch({
  //   url: `/photo-galleries?category_id=${id}`,
  // });

  return (
    <div>
      <Gallery data={galleryPhotos?.data} />
    </div>
  );
};

export default GalleryPage;
