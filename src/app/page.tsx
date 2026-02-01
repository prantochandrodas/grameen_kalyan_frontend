import React from 'react';

import { useFetch } from '@/shared/hook';
import {
  filterDataByKey,
  reverseFilterDataByKey,
} from '@/shared/utils/pageHelpers/filterData.helper';

import {
  HeroSection,
  AboutSection,
  BoardMember,
  AnnuallyServe,
  MicroHealthSection,
  StoriesSection,
  SevenPrinciple,
} from '@/components/Home';

import {
  ServiceSection,
  WorkTogether,
  AnnualReportSection,
} from '@/shared/components';
import VideoSection from '@/components/Home/videoSection/index.blade';

const Home = async () => {
  const homePageContentData = await useFetch({ url: '/home-contents' });
  const summeryReportData = await useFetch({
    url: '/summary-report-settings/basic',
  });
  const sliderImages = await useFetch({ url: '/home-slider-content' });
  const storyCategory = await useFetch({ url: '/story-categories' });
  const serviceContent = await useFetch({ url: '/service-contents/home' });

  const heroSliderImages = sliderImages?.data;
  const badgeImage = homePageContentData?.badge_image;

  const aboutSectionData = {
    title: homePageContentData?.intro_title,
    subTitleOne: homePageContentData?.intro_sub_title_one,
    subTitleTwo: homePageContentData?.intro_sub_title_two,
  };

  const boardMemberArray = [
    {
      id: 1,
      name: homePageContentData?.chairman_name,
      description: homePageContentData?.chairman_speech,
      designation: homePageContentData?.chairman_designation,
      image: homePageContentData?.chairman_thumb_image,
      reverse: false,
    },
    {
      id: 2,
      name: homePageContentData?.md_name,
      description: homePageContentData?.md_speech,
      designation: homePageContentData?.md_designation,
      image: homePageContentData?.md_thumb_image,
      reverse: true,
    },
  ];

  const annuallyWeServeData = filterDataByKey(
    summeryReportData?.data,
    'annually_we_serve'
  );
  const annuallyReportData = reverseFilterDataByKey(
    summeryReportData?.data,
    'annually_we_serve'
  );

  const microHealthData = homePageContentData?.mhi_banner_image;

  return (
    <>
      <HeroSection badgeImage={badgeImage} sliderImages={heroSliderImages} />
      <VideoSection />
      <AboutSection data={aboutSectionData} />
      <ServiceSection serviceData={serviceContent.data} />
      <BoardMember memberData={boardMemberArray} />
      <AnnuallyServe data={annuallyWeServeData} />
      <AnnualReportSection data={annuallyReportData} headingText="Annual" />
      <MicroHealthSection image={microHealthData} />
      <SevenPrinciple />
      <StoriesSection storyCategory={storyCategory.data} />
      <WorkTogether />
    </>
  );
};

export default Home;
