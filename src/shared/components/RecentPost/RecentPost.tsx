import React from 'react';

import RecentPostCard from './RecentPostCard/RecentPostCard';
import { Sliders } from '../Slider';
// import style from './recentPost.module.scss';
import { IStories } from '@/shared/types/stories';

import './recentPost.scss';
// const {
//   recentPost,
//   heading,
//   divider,
//   lineLeft,
//   box,
//   lineRight
// } = style;

interface IRecentPostProps {
  data: IStories[];
}

const RecentPost = ({ data }: IRecentPostProps) => {
  return (
    <div className="recentPost">
      <h2 className="heading">Recent Posts</h2>
      <div className="divider">
        <div className="lineLeft" />
        <div className="box" />
        <div className="lineRight" />
      </div>
      <div className="sliderContainer">
        <Sliders
          infinite={true}
          slideShow={3}
          slideToShowMob={1}
          autoPlay={true}
          autoplaySpeed={3000}
          arrows={true}
        >
          {data?.map((data) => (
            <RecentPostCard key={data.id} data={data} />
          ))}
        </Sliders>
      </div>
    </div>
  );
};

export default RecentPost;
