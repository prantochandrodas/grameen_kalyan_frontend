/* eslint-disable indent */
import React from 'react';

import ServiceCard from '../ServiceCard/ServiceCard';

import style from './serviceSection.module.scss';
import { IService } from '@/shared/types/service';

const { serviceSection } = style;

interface IServiceSectionProps {
  servicesData: IService[];
}

const ServiceSection = ({ servicesData }: IServiceSectionProps) => {
  return (
    <div className={serviceSection}>
      {servicesData &&
        servicesData.map((data, index) => {
          if (index % 2 === 0) {
            return (
              <div
                key={data.id}
                id={
                  data.title === 'Healthcare'
                    ? 'healthcare'
                    : data.title === 'Well-Being'
                      ? 'well-being'
                      : data.title === 'Emergency Response'
                        ? 'emergency-response'
                        : data.title === 'Social Business'
                          ? 'social-business'
                          : '#'
                }
              >
                <ServiceCard serviceData={data} reverse={true} />
              </div>
            );
          }

          return (
            <div
              key={data.id}
              id={
                data.title === 'Healthcare'
                  ? 'healthcare'
                  : data.title === 'Well-Being'
                    ? 'well-being'
                    : data.title === 'Emergency Response'
                      ? 'emergency-response'
                      : data.title === 'Social Business'
                        ? 'social-business'
                        : '#'
              }
            >
              <ServiceCard serviceData={data} key={data.id} />
            </div>
          );
        })}
    </div>
  );
};

export default ServiceSection;
