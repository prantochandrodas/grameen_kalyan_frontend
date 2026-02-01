import { ICorporate } from '@/shared/types/corporate';

export const handleMiddleIndex = (
  dataSet: ICorporate[],
  middleIndex: number
) => {
  let middleIndexOne = middleIndex;

  const middleDataOne =
    dataSet &&
    dataSet.map((data: ICorporate, index: number) => {
      let array;

      if (index === middleIndexOne) {
        middleIndexOne += 4;
        array = data;
      }
      return array;
    });

  const filterMiddleDataOne =
    middleDataOne && middleDataOne.filter((data) => data !== undefined);

  return filterMiddleDataOne;
};
