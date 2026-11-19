import React from 'react';

import { BoardMemberDetail } from '@/components/BoardMember';
import { IBoardMember } from '@/shared/types/boardMember';
import useFetchLaravelData from '@/shared/hook/useFetchData/useFetchData';

const BoardMemberDetails = async ({
  params,
}: {
  params: { memberDetail: number };
}) => {
  const id = parseInt(params.memberDetail.toString());
  const boardMember = await useFetchLaravelData({ url: '/members' });
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
