import { IAnnuallyServe } from '@/shared/types/annuallyServe';
export interface IAnnualReportSection {
  data: IAnnuallyServe[];
  headingText: string;
  headingTop?: boolean;
}
