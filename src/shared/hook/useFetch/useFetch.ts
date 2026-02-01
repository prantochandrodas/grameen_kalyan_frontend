import { BASE_URL } from '@/config';

import { IUseFetchProps } from './useFetch.type';

export default async function useFetch({ url, revalidateIn }: IUseFetchProps) {
  try {
    const res = await fetch(BASE_URL + url, { cache: 'no-cache' });

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await res.json();
    return data;
  } catch (error: unknown) {
    const errorInstance = error instanceof Error;
    const errMessage = errorInstance ? error.message : 'Something went wrong';
    return errMessage;
  }
}
