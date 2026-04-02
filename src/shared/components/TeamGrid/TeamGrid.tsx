// import React from 'react';

// import HorizontalLayout from '@/components/About/BoardMemberSection/HorizontalLayout/HorizontalLayout';

// import { TeamMemberCard } from '../TeamMemberCard';
// import { handleMiddleIndex } from './teamGrid.helpers';
// import style from './teamGrid.module.scss';
// import { ITeamGrid } from '@/shared/types/teanGrid';

// const { gridContainer, cardContainer, layout } = style;

// interface ITeamGridProps {
//   datas: ITeamGrid[];
// }

// const TeamGrid = ({ datas }: ITeamGridProps) => {



//   const middleDataOne = handleMiddleIndex(datas, 1);
//   const middleDataTwo = handleMiddleIndex(datas, 2);
//   const firstData = handleMiddleIndex(datas, 0);
//   const lastData = handleMiddleIndex(datas, 3);


//   let counter = 0;
//   return (

//     <div className={gridContainer}>

//       {datas &&
//         datas.map((data, index) => {
//           const isAfterFourMember = (index + 1) % 4 === 0;
//           const isDataEnd = index === datas.length - 1;
//           const counterArray: number[] = [];
//           const detectLastLineArray: number[] = [];
//           detectLastLineArray.push(index);
//           const isNumberFour = datas.length === 4;
//           const oddNumber = detectLastLineArray.filter(
//             (count) => count % 2 !== 0
//           );
//           const evenNumber = detectLastLineArray.filter(
//             (count) => count % 2 === 0
//           );

//           if (isAfterFourMember === true) {
//             counter += 1;
//             counterArray.push(counter);
//           }

//           const isFirstData = firstData.some(
//             (firstData) => firstData?.id === data.id
//           );
//           const isMiddleDataOne = middleDataOne.some(
//             (middileData) => middileData?.id === data.id
//           );
//           const isMiddleDataTwo = middleDataTwo.some(
//             (middileData) => middileData?.id === data.id
//           );
//           const isLastData = lastData.some(
//             (lastData) => lastData?.id === data.id
//           );

//           return (
//             <>
//               <div className={cardContainer}>
//                 {isMiddleDataOne ? (
//                   <TeamMemberCard data={data} typeTwo={true} />
//                 ) : isMiddleDataTwo ? (
//                   <TeamMemberCard data={data} typeTwo={true} />
//                 ) : isFirstData ? (
//                   <TeamMemberCard data={data} typeOne={true} />
//                 ) : isLastData ? (
//                   <TeamMemberCard data={data} typeThree={true} />
//                 ) : (
//                   <TeamMemberCard data={data} />
//                 )}
//               </div>
//               {counterArray &&
//                 counterArray.map((counter) => {
//                   const oddNumber = counter % 2 !== 0;
//                   const evenNumber = counter % 2 === 0;

//                   return evenNumber ? (
//                     <div className={layout}>
//                       <HorizontalLayout />
//                     </div>
//                   ) : oddNumber ? (
//                     <div className={layout}>
//                       <HorizontalLayout reverse={true} />
//                     </div>
//                   ) : null;
//                 })}
//               {isDataEnd && evenNumber && isNumberFour === false ? (
//                 <div className={layout}>
//                   <HorizontalLayout />
//                 </div>
//               ) : isDataEnd && oddNumber && isNumberFour === false ? (
//                 <div className={layout}>
//                   <HorizontalLayout reverse={true} />
//                 </div>
//               ) : null}
//             </>
//           );
//         })}
//     </div>
//   );
// };

// export default TeamGrid;

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

  // ✅ SORT (serial_no nai gula last e jabe)
  const sortedDatas = [...datas].sort((a, b) => {
    if (a.serial_no == null) return 1;
    if (b.serial_no == null) return -1;
    return a.serial_no - b.serial_no;
  });

  const middleDataOne = handleMiddleIndex(sortedDatas, 1);
  const middleDataTwo = handleMiddleIndex(sortedDatas, 2);
  const firstData = handleMiddleIndex(sortedDatas, 0);
  const lastData = handleMiddleIndex(sortedDatas, 3);

  let counter = 0;

  return (
    <div className={gridContainer}>

      {sortedDatas &&
        sortedDatas.map((data, index) => {

          const isAfterFourMember = (index + 1) % 4 === 0;
          const isDataEnd = index === sortedDatas.length - 1;

          const counterArray: number[] = [];
          const detectLastLineArray: number[] = [];

          detectLastLineArray.push(index);

          const isNumberFour = sortedDatas.length === 4;

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
            <React.Fragment key={data.id}>

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

              {/* After every 4 items layout */}
              {counterArray.map((counter) => {
                const isOdd = counter % 2 !== 0;
                const isEven = counter % 2 === 0;

                return isEven ? (
                  <div className={layout} key={`even-${counter}`}>
                    <HorizontalLayout />
                  </div>
                ) : isOdd ? (
                  <div className={layout} key={`odd-${counter}`}>
                    <HorizontalLayout reverse={true} />
                  </div>
                ) : null;
              })}

              {/* Last line layout */}
              {isDataEnd && evenNumber.length > 0 && isNumberFour === false ? (
                <div className={layout}>
                  <HorizontalLayout />
                </div>
              ) : isDataEnd && oddNumber.length > 0 && isNumberFour === false ? (
                <div className={layout}>
                  <HorizontalLayout reverse={true} />
                </div>
              ) : null}

            </React.Fragment>
          );
        })}
    </div>
  );
};

export default TeamGrid;