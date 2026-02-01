import React from 'react';
import Link from 'next/link';

import { handleMiddleIndex } from './boardMemberSection.helpers';
import { IBoardMemberSectionProps } from './BoardMemberSection.types';
import BoardMemberCard from './BoardMemberCard/BoardMemberCard';
import HorizontalLayout from './HorizontalLayout/HorizontalLayout';

import style from './boardMemberSection.module.scss';

const {
  boardMemberSection,
  heading,
  gridContainer,
  layout,
  cardContainer,
  link,
} = style;

const BoardMemberSection = ({ boardMembersData }: IBoardMemberSectionProps) => {
  const chairman = boardMembersData.filter(
    (data) => data.designation === 'Chairman'
  );
  const boardMembers = boardMembersData.filter(
    (data) => data.designation !== 'Chairman'
  );
  const middleDataOne = handleMiddleIndex(boardMembers, 1);
  const middleDataTwo = handleMiddleIndex(boardMembers, 2);
  const firstData = handleMiddleIndex(boardMembers, 0);
  const lastData = handleMiddleIndex(boardMembers, 3);
  let counter = 0;

  return (
    <div className={boardMemberSection}>
      <h2 className={heading}>Board Members</h2>
      {chairman.map((data) => {
        return (
          <>
            <div key={data.id} className={cardContainer}>
              <Link className={link} href={`/board-member/${data.id}`}>
                <BoardMemberCard data={data} />
              </Link>
            </div>
            <HorizontalLayout key={data.id} />
          </>
        );
      })}
      <div className={gridContainer}>
        {boardMembers.map((data, index) => {
          const isAfterFourMember = (index + 1) % 4 === 0;
          const isDataEnd = index === boardMembers.length - 1;
          const counterArray: number[] = [];
          const oddNumber = counterArray.filter((count) => count % 2 !== 0);
          const evenNumber = counterArray.filter((count) => count % 2 === 0);

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
              <Link className={link} href={`/board-member/${data.id}`}>
                <div className={cardContainer}>
                  {isMiddleDataOne ? (
                    <BoardMemberCard data={data} typeTwo={true} />
                  ) : isMiddleDataTwo ? (
                    <BoardMemberCard data={data} typeTwo={true} />
                  ) : isFirstData ? (
                    <BoardMemberCard data={data} typeOne={true} />
                  ) : isLastData ? (
                    <BoardMemberCard data={data} typeThree={true} />
                  ) : (
                    <BoardMemberCard data={data} />
                  )}
                </div>
              </Link>
              {counterArray.map((counter) => {
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
              {isDataEnd && evenNumber ? (
                <div className={layout}>
                  <HorizontalLayout />
                </div>
              ) : isDataEnd && oddNumber ? (
                <div className={layout}>
                  <HorizontalLayout reverse={true} />
                </div>
              ) : null}
            </>
          );
        })}
      </div>
    </div>
  );
};

export default BoardMemberSection;
