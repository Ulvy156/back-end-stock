import { CustomerType } from 'generated/prisma';

export interface FindAllCustomer {
  page: number;
  limit: number;
  name: string;
  phone_number: string;
  province_id: number;
  district_id: string;
  type: CustomerType | null;
}
