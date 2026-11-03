import React from 'react';
import Link from 'next/link';

import { Reveal, RevealText } from '../Motion';
import { asArray } from '../Shared/aboutHelpers';
import { IBoardMember } from '@/shared/types/boardMember';

import { IBoardMemberSectionProps } from './BoardMemberSection.types';
import BoardMemberCard from './BoardMemberCard/BoardMemberCard';
import HorizontalLayout from './HorizontalLayout/HorizontalLayout';

import style from './boardMemberSection.module.scss';

const {
  boardMemberSection,
  container,
  header,
  eyebrow,
  heading,
  chairmanRow,
  gridContainer,
  layout,
  link,
} = style;

const COLUMNS = 4; // desktop grid columns (dividers are drawn after every row)

const BoardMemberSection = ({ boardMembersData }: IBoardMemberSectionProps) => {
  const members = asArray<IBoardMember>(boardMembersData);

  const chairman = members.filter((data) => data.designation === 'Chairman');
  const boardMembers = members.filter(
    (data) => data.designation !== 'Chairman'
  );

  if (!members.length) return null;

  return (
    <section className={boardMemberSection}>
      <div className={container}>
        <header className={header}>
          <RevealText
            as="h2"
            className={heading}
            lines={[{ text: 'Board Members' }]}
          />
        </header>

        {chairman.map((data) => (
          <React.Fragment key={data.id}>
            <div className={chairmanRow}>
              <Link className={link} href={`/board-member/${data.id}`}>
                <Reveal distance={40}>
                  <BoardMemberCard data={data} featured />
                </Reveal>
              </Link>
            </div>
            <HorizontalLayout />
          </React.Fragment>
        ))}

        <div className={gridContainer}>
          {boardMembers.map((data, index) => {
            const rowNumber = Math.floor(index / COLUMNS) + 1;
            const isRowEnd = (index + 1) % COLUMNS === 0;
            const isDataEnd = index === boardMembers.length - 1;
            const showDivider = isRowEnd || isDataEnd;
            const isReverseDivider = rowNumber % 2 !== 0;

            return (
              <React.Fragment key={data.id}>
                <Link
                  className={link}
                  href={`/board-member/${data.id}`}
                  data-col={index % COLUMNS}
                >
                  <Reveal distance={44} delay={(index % COLUMNS) * 0.08}>
                    <BoardMemberCard data={data} />
                  </Reveal>
                </Link>
                {showDivider && (
                  <div className={layout}>
                    <HorizontalLayout reverse={isReverseDivider} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BoardMemberSection;