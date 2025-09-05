import type { HttpStatusCode } from '../../enum/http-status';

export interface apiResponseType<T = any> {
  message: string;
  status: HttpStatusCode;
  data: T | null;
}
