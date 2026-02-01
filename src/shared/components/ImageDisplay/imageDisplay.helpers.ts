import { ICategory } from './../../types/category';

interface filterDataProps {
  data: ICategory[];
  from: number;
  to: number;
}

export const filterData = ({ data, from, to }: filterDataProps) => {
  const dataFiltered = data?.slice(from - 1, to);

  return dataFiltered;
};
