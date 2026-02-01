import { IAnnuallyServe } from '@/shared/types/annuallyServe';
import { ICorporate } from '@/shared/types/corporate';

export function filterDataByKey(data: IAnnuallyServe[], key?: string) {
  return data && data.filter((item) => item.key === key);
}

export function reverseFilterDataByKey(data: IAnnuallyServe[], key?: string) {
  return data && data.filter((item) => item.key !== key);
}

export function filterDataByDepartment(data: ICorporate[], key?: string) {
  return data && data.filter((item) => item.department === key);
}
