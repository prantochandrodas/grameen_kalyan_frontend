import React from 'react';

import {
  MissionVision,
  AboutUs,
  EmpoweringSection,
  OurProudSection,
  AboutGrameenKalyan,
  AchievementSection,
  BoardMemberSection,
} from '@/components/About';
import {
  HeroSection,
  ServiceSection,
  AnnualReportSection,
  WorkTogether,
} from '@/shared/components';
import { useFetch } from '@/shared/hook';
import { reverseFilterDataByKey } from '@/shared/utils/pageHelpers/filterData.helper';

const About = async () => {
  const aboutUsData = await useFetch({ url: '/about-us-contents' });
  const summeryReportData = await useFetch({
    url: '/summary-report-settings/basic',
  });
  const ourProudPresenceData = await useFetch({
    url: '/summary-report-settings/healthcare',
  });
  const achievementData = await useFetch({ url: '/timeline' });
  const boardMemberData = await useFetch({ url: '/members' });
  const serviceContent = await useFetch({ url: '/service-contents/home' });

  const mission = aboutUsData?.mission;
  const vision = aboutUsData?.vision;

  const aboutSectionData = {
    heading: aboutUsData?.company_intro_title,
    description: aboutUsData?.company_intro_description,
  };

  const annuallyReportData = reverseFilterDataByKey(
    summeryReportData?.data,
    'annually_we_serve'
  );

  const empoweringSectionData = {
    title: aboutUsData?.inception_title,
    details: aboutUsData?.inception_details,
  };

  const aboutGrameenKalyanSectionData = aboutUsData?.presence_details;

  return (
    <>
      <HeroSection
        titleOne="With Joy"
        titleTwo="We Grow Together"
        titleThree="We Serve Together"
      />
      <MissionVision mission={mission} vision={vision} />
      <ServiceSection serviceData={serviceContent?.data} />
      <AboutUs data={aboutSectionData} />
      <AnnualReportSection
        data={annuallyReportData}
        headingTop={true}
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
      <WorkTogether />
    </>
  );
};

export default About;
