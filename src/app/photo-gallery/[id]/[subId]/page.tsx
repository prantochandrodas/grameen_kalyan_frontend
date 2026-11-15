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

  // Get the current sub-album's own title for the heading
  const photoAlbums = await useFetchLaravelData({ url: '/photo-albums' });
  const album = Array.isArray(photoAlbums?.data)
    ? photoAlbums.data.find((item: any) => Number(item.id) === id)
    : null;
  const subAlbum = Array.isArray(album?.sub_albums)
    ? album.sub_albums.find((item: any) => Number(item.id) === subId)
    : null;

  return (
    <div>
      <Gallery
        data={galleryPhotos?.data}
        title={subAlbum?.title}
        backHref={`/photo-gallery/${id}`}
        backLabel="Back to Albums"
      />
    </div>
  );
};

export default SubAlbumGalleryPage;