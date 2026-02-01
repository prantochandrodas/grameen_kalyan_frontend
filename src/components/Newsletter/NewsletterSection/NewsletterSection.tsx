import React from 'react';
import Link from 'next/link';

import { INewsletter } from '@/shared/types/newsletter';
import { NewsletterCard } from '@/shared/components/NewsletterCard';

import style from './newsletterSection.module.scss';
const { newsletterList, link } = style;

interface INewsletterSectionProps {
  data: INewsletter[];
}

const NewsletterSection = ({ data }: INewsletterSectionProps) => {
  return (
    <div className={newsletterList}>
      {data?.map((item, index) => (
        <Link className={link} href={item.link} key={index} target="_blank">
          <NewsletterCard data={item} />
        </Link>
      ))}
    </div>
  );
};

export default NewsletterSection;
