import React from 'react';

import Gallery from '@/components/PhotoGallery/Gallery/Gallery';
import useFetchLaravelData from '@/shared/hook/useFetchData/useFetchData';

const SubAlbumGalleryPage = async ({
  params,
}: {
  params: { id: number; subId: number };
}) => {
  const id = parseInt(params.id.toString());
  const subId = parseInt(params.subId.toString());

  const galleryPhotos = await useFetchLaravelData({
    url: `/photo-galleries?category_id=${id}&sub_album_id=${subId}`,
  });

  return (
    <div>
      <Gallery
        data={galleryPhotos?.data}
        backHref={`/photo-gallery/${id}`}
        backLabel="Back to Albums"
      />
    </div>
  );
};

export default SubAlbumGalleryPage;