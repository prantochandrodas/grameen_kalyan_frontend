import React from 'react';

import { MissionVision } from '@/components/About/MissionVision';
import { AboutUs } from '@/components/About/AboutUs';
import { EmpoweringSection } from '@/components/About/EmpoweringSection';
import { OurProudSection } from '@/components/About/OurProudSection';
import { AboutGrameenKalyan } from '@/components/About/AboutGrameenKalyan';
import { AchievementSection } from '@/components/About/AchievementSection';
import { BoardMemberSection } from '@/components/About/BoardMemberSection';
import { ParallaxHero } from '@/components/About/ParallaxHero';
import { ImpactAreas } from '@/components/About/ImpactAreas';
import WorkTogether from '@/shared/components/WorkTogether/WorkTogether';
import MotionProvider from '@/components/About/Motion/MotionProvider';
import { StoryOfInceptionSection } from '@/components/About/StoryOfInceptionSection';
import { asArray } from '@/components/About/Shared/aboutHelpers';
import useFetchLaravelData from '@/shared/hook/useFetchData/useFetchData';
import { reverseFilterDataByKey } from '@/shared/utils/pageHelpers/filterData.helper';
import { IAnnuallyServe } from '@/shared/types/annuallyServe';

const About = async () => {
  // all endpoints are independent -> fetch them in parallel
  const [
    bannerData,
    aboutUsData,
    summeryReportData,
    ourProudPresenceData,
    achievementData,
    boardMemberData,
    serviceContent,
    homePageContentData,
  ] = await Promise.all([
    useFetchLaravelData({ url: '/banners/about' }),
    useFetchLaravelData({ url: '/about-us-contents' }),
    useFetchLaravelData({ url: '/summary-report-settings/basic' }),
    useFetchLaravelData({ url: '/summary-report-settings/healthcare' }),
    useFetchLaravelData({ url: '/timeline' }),
    useFetchLaravelData({ url: '/members' }),
    useFetchLaravelData({ url: '/service-contents/home' }),
    useFetchLaravelData({ url: '/home-contents' }),
  ]);

  const mission = aboutUsData?.mission;
  const vision = aboutUsData?.vision;
  const missionVisionTitle = aboutUsData?.mission_vision_title;
  const missionVisionSubtitle = aboutUsData?.mission_vision_subtitle;

  const aboutSectionData = {
    heading: aboutUsData?.company_intro_title,
    description: aboutUsData?.company_intro_description,
  };

  const annuallyReportData = reverseFilterDataByKey(
    asArray<IAnnuallyServe>(summeryReportData?.data),
    'annually_we_serve'
  );

  const empoweringSectionData = {
    title: aboutUsData?.inception_title,
    details: aboutUsData?.inception_details,
  };

  const aboutGrameenKalyanSectionData = aboutUsData?.presence_details;

  const workTogetherImage = homePageContentData?.work_together_image;
  const annuallyServeImage = homePageContentData?.annually_serve;

  return (
    <MotionProvider>
      <main>
        <ParallaxHero
          title={bannerData?.data?.title}
          subtitle={bannerData?.data?.subtitle}
          backgroundImage={bannerData?.data?.banner}
        />
        <MissionVision
          title={missionVisionTitle}
          subtitle={missionVisionSubtitle}
          mission={mission}
          vision={vision}
        />
        <ImpactAreas serviceData={serviceContent?.data} />
        <AboutUs data={aboutSectionData} />
        <StoryOfInceptionSection
          data={annuallyReportData}
          image={annuallyServeImage}
          headingText="Story of Inception"
        />
        <EmpoweringSection empoweringData={empoweringSectionData} />
        <OurProudSection
          proudPresenceData={ourProudPresenceData?.data}
          headingText="Our Proud Presence"
          subHeadingText="Across the Country"
        />
        <AboutGrameenKalyan aboutGkData={aboutGrameenKalyanSectionData} />
        <AchievementSection achievementData={achievementData?.data} />
        <BoardMemberSection boardMembersData={boardMemberData?.data} />
        <WorkTogether image={workTogetherImage} />
      </main>
    </MotionProvider>
  );
};

export default About;