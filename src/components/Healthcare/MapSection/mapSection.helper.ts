/* eslint-disable quotes */
/* eslint-disable react-hooks/rules-of-hooks */

import { useFetch } from '@/shared/hook';

export async function getDataByDivisionId(divisionId: string | number) {
  const data = await useFetch({
    url: `/get-health-centers?division_id=${divisionId}`,
  });

  return data;
}

export async function getDataByKeyword(keyword: string | null) {
  const data = await useFetch({
    url: `/get-health-centers?keyword=${keyword}`,
  });

  return data;
}

export async function getDataByHealthCenterId(
  healthCenterId: number | string | null
) {
  const data = await useFetch({
    url: `/get-health-centers?health_center_id=${healthCenterId}`,
  });

  return data;
}
