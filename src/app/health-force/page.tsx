/* eslint-disable comma-dangle */
/* eslint-disable operator-linebreak */
import React from 'react';

import { useFetch } from '@/shared/hook';
import { AboutSection } from '@/components/HealthForce';
import {
  HeroSection,
  TeamGrid,
  TeamGroup,
  WorkTogether,
} from '@/shared/components';
import { filterDataByDepartment } from '@/shared/utils/pageHelpers/filterData.helper';

const bgHero =
  'https://res.cloudinary.com/dboyf6lad/image/upload/v1692259177/IMG_1382_bhjrmk.jpg';
const doctorsImg =
  'https://res.cloudinary.com/dboyf6lad/image/upload/v1692609361/our-doctors-full_p5yajx.jpg';
const dmfsImg =
  'https://res.cloudinary.com/dboyf6lad/image/upload/v1692609361/dmfs-full_c7ihh5.jpg';
const communityImg =
  'https://res.cloudinary.com/dboyf6lad/image/upload/v1692609361/assistants-full_b5gaak.jpg';
const regionalManagersImg =
  'https://res.cloudinary.com/dd1yxy9yy/image/upload/v1709014836/alternative_of_RM_group_photo_fnq48m.jpg';

const HealthForce = async () => {
  const corporate = await useFetch({ url: '/peoples' });

  const filterRegionalManagersData = filterDataByDepartment(
    corporate?.data,
    'Regional Manager'
  );
  const filterDoctorsData = filterDataByDepartment(corporate?.data, 'Doctors');
  const filterDMFsData = filterDataByDepartment(corporate?.data, 'DMFs');
  const filterCommunityHealthAssistantsData = filterDataByDepartment(
    corporate?.data,
    'Community Health Assistants'
  );

  return (
    <>
      <HeroSection
        titleOne="Serving Bottom of the"
        titleTwo="Pyramid with Utmost"
        titleThree="Care and Sincerity"
        backgroundImage={bgHero}
      />
      <AboutSection />
      <TeamGroup
        headingTextOne="Our Regional"
        headingTextTwo="Managers"
        image={regionalManagersImg}
      />
      <TeamGrid datas={filterRegionalManagersData} />
      <TeamGroup
        headingTextOne=""
        headingTextTwo="Our Doctors"
        image={doctorsImg}
      />
      <TeamGrid datas={filterDoctorsData} />
      <TeamGroup headingTextTwo="Our DMFs" marginTop image={dmfsImg} />
      <TeamGrid datas={filterDMFsData} />
      <TeamGroup
        headingTextOne="Our Community"
        headingTextTwo="Health Assistants"
        marginTop
        image={communityImg}
      />
      <TeamGrid datas={filterCommunityHealthAssistantsData} />
      <WorkTogether />
    </>
  );
};

export default HealthForce;
