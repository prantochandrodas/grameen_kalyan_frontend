

import { LARAVEL_BASE_URL } from '@/config';
import { IUseFetchProps } from '../useFetch/useFetch.type';



export default async function useFetchLaravelData({ url, revalidateIn }: IUseFetchProps) { 
  try {
    const res = await fetch('http://127.0.0.1:8000/api' + url, { cache: 'no-cache' });
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
