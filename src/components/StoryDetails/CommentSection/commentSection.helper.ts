/* eslint-disable react-hooks/rules-of-hooks */

import { useFetch } from '@/shared/hook';

export async function getAllComments(contentId: number) {
  const data = await useFetch({ url: `/comments?content_id=${contentId}` });

  return data;
}
