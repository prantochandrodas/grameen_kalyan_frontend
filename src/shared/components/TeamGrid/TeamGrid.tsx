import React from 'react';

import HorizontalLayout from '@/components/About/BoardMemberSection/HorizontalLayout/HorizontalLayout';

import { TeamMemberCard } from '../TeamMemberCard';
import { handleMiddleIndex } from './teamGrid.helpers';
import style from './teamGrid.module.scss';
import { ITeamGrid } from '@/shared/types/teanGrid';

const { gridContainer, cardContainer, layout } = style;

interface ITeamGridProps {
  datas: ITeamGrid[];
}

const TeamGrid = ({ datas }: ITeamGridProps) => {
  const middleDataOne = handleMiddleIndex(datas, 1);
  const middleDataTwo = handleMiddleIndex(datas, 2);
  const firstData = handleMiddleIndex(datas, 0);
  const lastData = handleMiddleIndex(datas, 3);
  let counter = 0;

  return (
    <div className={gridContainer}>
      {datas &&
        datas.map((data, index) => {
          const isAfterFourMember = (index + 1) % 4 === 0;
          const isDataEnd = index === datas.length - 1;
          const counterArray: number[] = [];
          const detectLastLineArray: number[] = [];
          detectLastLineArray.push(index);
          const isNumberFour = datas.length === 4;
          const oddNumber = detectLastLineArray.filter(
            (count) => count % 2 !== 0
          );
          const evenNumber = detectLastLineArray.filter(
            (count) => count % 2 === 0
          );

          if (isAfterFourMember === true) {
            counter += 1;
            counterArray.push(counter);
          }

          const isFirstData = firstData.some(
            (firstData) => firstData?.id === data.id
          );
          const isMiddleDataOne = middleDataOne.some(
            (middileData) => middileData?.id === data.id
          );
          const isMiddleDataTwo = middleDataTwo.some(
            (middileData) => middileData?.id === data.id
          );
          const isLastData = lastData.some(
            (lastData) => lastData?.id === data.id
          );

          return (
            <>
              <div className={cardContainer}>
                {isMiddleDataOne ? (
                  <TeamMemberCard data={data} typeTwo={true} />
                ) : isMiddleDataTwo ? (
                  <TeamMemberCard data={data} typeTwo={true} />
                ) : isFirstData ? (
                  <TeamMemberCard data={data} typeOne={true} />
                ) : isLastData ? (
                  <TeamMemberCard data={data} typeThree={true} />
                ) : (
                  <TeamMemberCard data={data} />
                )}
              </div>
              {counterArray &&
                counterArray.map((counter) => {
                  const oddNumber = counter % 2 !== 0;
                  const evenNumber = counter % 2 === 0;

                  return evenNumber ? (
                    <div className={layout}>
                      <HorizontalLayout />
                    </div>
                  ) : oddNumber ? (
                    <div className={layout}>
                      <HorizontalLayout reverse={true} />
                    </div>
                  ) : null;
                })}
              {isDataEnd && evenNumber && isNumberFour === false ? (
                <div className={layout}>
                  <HorizontalLayout />
                </div>
              ) : isDataEnd && oddNumber && isNumberFour === false ? (
                <div className={layout}>
                  <HorizontalLayout reverse={true} />
                </div>
              ) : null}
            </>
          );
        })}
    </div>
  );
};

export default TeamGrid;
