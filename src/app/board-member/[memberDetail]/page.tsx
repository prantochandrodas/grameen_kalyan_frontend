import React from 'react';

import { BoardMemberDetail } from '@/components/BoardMember';
import { useFetch } from '@/shared/hook';
import { IBoardMember } from '@/shared/types/boardMember';

const BoardMemberDetails = async ({
  params,
}: {
  params: { memberDetail: number };
}) => {
  const id = parseInt(params.memberDetail.toString());
  const boardMember = await useFetch({ url: '/members' });
  const detailData = boardMember?.data?.find(
    (data: IBoardMember) => data.id === id
  );

  return (
    <>
      <BoardMemberDetail data={detailData} />
    </>
  );
};

export default BoardMemberDetails;
