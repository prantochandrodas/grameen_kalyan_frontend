import React from 'react';

import { HeroSection, WorkTogether } from '@/shared/components';
import { SearchResult } from '@/components/Search';
import { useFetch } from '@/shared/hook';

const heroImage =
  'https://res.cloudinary.com/dboyf6lad/image/upload/v1690783090/joinus-bg_rst7hy.webp';

const Search = async ({ params }: { params: { searchResult: string } }) => {
  const keyword = params.searchResult;

  const searchResult = await useFetch({
    url: `/search-results?search=${keyword}`,
  });
  const homePageContentData = await useFetch({ url: '/home-contents' });
  const workTogetherImage = homePageContentData?.work_together_image;
  return (
    <>
      <HeroSection heroFor="search" backgroundImage={heroImage} />
      <SearchResult searchResultData={searchResult.data.health_centers} />
      <WorkTogether image={workTogetherImage} />
    </>
  );
};

export default Search;
