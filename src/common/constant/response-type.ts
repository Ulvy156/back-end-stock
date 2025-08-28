import type { HttpStatusCode } from './http-status.constant';

export interface apiResponseType<T = any> {
  message: string;
  status: HttpStatusCode;
  data: T | null;
}
