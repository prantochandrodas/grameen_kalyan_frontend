import React from 'react';

import {
  HeroSection,
  TeamGrid,
  TeamGroup,
  WorkTogether,
} from '@/shared/components';
import { PeopleCulture } from '@/components/Corporate';
import { useFetch } from '@/shared/hook';
import { filterDataByDepartment } from '@/shared/utils/pageHelpers/filterData.helper';

const Corporate = async () => {
  const corporate = await useFetch({ url: '/peoples' });

  const filterManagementData = filterDataByDepartment(
    corporate?.data,
    'Management'
  );
  const filterAccountAndFinanceData = filterDataByDepartment(
    corporate?.data,
    'Account & Finance'
  );
  const filterHumanResourceData = filterDataByDepartment(
    corporate?.data,
    'Human Resources & Administration'
  );
  const filterServicesAndProcurementData = filterDataByDepartment(
    corporate?.data,
    'Services & Procurement'
  );
  const filterAuditData = filterDataByDepartment(
    corporate?.data,
    'Audit & Internal Compliance'
  );
  const filterBrandingAndSecretariatData = filterDataByDepartment(
    corporate?.data,
    'Branding & Secretariat'
  );
  const filterTrainingData = filterDataByDepartment(
    corporate?.data,
    'Training'
  );
  const filterTechnologyData = filterDataByDepartment(
    corporate?.data,
    'Information Technology (IT)'
  );

  const bgHero =
    'https://res.cloudinary.com/dboyf6lad/image/upload/v1693472682/MicrosoftTeams-image_80_wmqvsd.png';
  const managementImg =
    'https://res.cloudinary.com/dboyf6lad/image/upload/v1692608043/management-leadership-_1__cnt3vv.jpg';
  const accountImg =
    'https://res.cloudinary.com/dboyf6lad/image/upload/v1692608043/account-finance_apn4ac.jpg';
  const hrImg =
    'https://res.cloudinary.com/dboyf6lad/image/upload/v1692608044/resource-full_yrklg7.jpg';
  const servicesImg =
    'https://res.cloudinary.com/dboyf6lad/image/upload/v1692608042/procurement_gocoxd.jpg';
  const auditImg =
    'https://res.cloudinary.com/dboyf6lad/image/upload/v1692608042/audit-internal_bdrn5d.jpg';
  const brandingImg =
    'https://res.cloudinary.com/dboyf6lad/image/upload/v1692608043/brand-full_rpfuxj.jpg';
  const trainingImg =
    'https://res.cloudinary.com/dboyf6lad/image/upload/v1692608043/training_section_banner_mukpax.jpg';
  const itImg =
    'https://res.cloudinary.com/dboyf6lad/image/upload/v1692608043/information_technology_section_banner_t3wy0u.jpg';

  return (
    <>
      <HeroSection
        titleOne="Serving Bottom of the"
        titleTwo="Pyramid with Utmost"
        titleThree="Care and Sincerity"
        backgroundImage={bgHero}
      />
      <PeopleCulture />
      <TeamGroup
        headingTextOne="Management"
        headingTextTwo="Leadership"
        image={managementImg}
      />
      <TeamGrid datas={filterManagementData} />
      <TeamGroup
        headingTextOne="Accounts & Finance"
        marginTop
        image={accountImg}
      />
      <TeamGrid datas={filterAccountAndFinanceData} />
      <TeamGroup
        headingTextOne="Human Resources &"
        headingTextTwo="Administration"
        marginTop
        image={hrImg}
      />
      <TeamGrid datas={filterHumanResourceData} />
      <TeamGroup
        headingTextOne="Services & Procurement"
        marginTop
        image={servicesImg}
      />
      <TeamGrid datas={filterServicesAndProcurementData} />
      <TeamGroup
        headingTextTwo="Audit & Internal Compliance"
        marginTop
        image={auditImg}
      />
      <TeamGrid datas={filterAuditData} />
      <TeamGroup
        headingTextOne="M&E, Branding & Communications"
        headingTextTwo="and Secretariate"
        marginTop
        image={brandingImg}
      />
      <TeamGrid datas={filterBrandingAndSecretariatData} />
      <TeamGroup headingTextTwo="Training" marginTop image={trainingImg} />
      <TeamGrid datas={filterTrainingData} />
      <TeamGroup
        headingTextTwo="Information Technology (IT)"
        marginTop
        image={itImg}
      />
      <TeamGrid datas={filterTechnologyData} />
      <WorkTogether />
    </>
  );
};

export default Corporate;
