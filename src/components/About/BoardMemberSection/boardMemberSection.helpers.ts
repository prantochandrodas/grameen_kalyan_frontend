import { IBoardMember } from '@/shared/types/boardMember';

export const handleMiddleIndex = (
  dataSet: IBoardMember[],
  middleIndex: number
) => {
  let middleIndexOne = middleIndex;

  const middleDataOne = dataSet.map((data: IBoardMember, index: number) => {
    let array;

    if (index === middleIndexOne) {
      middleIndexOne += 4;
      array = data;
    }
    return array;
  });

  const filterMiddleDataOne = middleDataOne.filter(
    (data) => data !== undefined
  );

  return filterMiddleDataOne;
};
