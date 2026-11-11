import React from 'react';

import Gallery from '@/components/PhotoGallery/Gallery/Gallery';
import SubAlbum from '@/components/PhotoGallery/SubAlbum/SubAlbum';
import useFetchLaravelData from '@/shared/hook/useFetchData/useFetchData';

const GalleryPage = async ({ params }: { params: { id: number } }) => {
  const id = parseInt(params.id.toString());

  // 1) Check whether this album has child albums
  const photoAlbums = await useFetchLaravelData({ url: '/photo-albums' });
  const album = Array.isArray(photoAlbums?.data)
    ? photoAlbums.data.find((item: any) => Number(item.id) === id)
    : null;
  const subAlbums = Array.isArray(album?.sub_albums)
    ? album.sub_albums.filter((item: any) => String(item.is_active) !== '0')
    : [];

  // 2) Has child albums: show child albums first
  if (subAlbums.length > 0) {
    return (
      <div>
        <SubAlbum albumId={id} albumTitle={album.title} subAlbums={subAlbums} />
      </div>
    );
  }

  // 3) No child albums: show gallery images directly
  const galleryPhotos = await useFetchLaravelData({
    url: `/photo-galleries?category_id=${id}`,
  });

  return (
    <div>
      <Gallery data={galleryPhotos?.data} />
    </div>
  );
};

export default GalleryPage;
