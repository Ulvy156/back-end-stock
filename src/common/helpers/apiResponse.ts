import type { HttpStatusCode } from '../../enum/http-status';
import type { apiResponseType } from '../constant/response-type';

export default function apiResponse<T>(
  status: HttpStatusCode = 200,
  message: string = 'Success',
  data: T | null = null,
): apiResponseType<T> {
  return {
    status,
    message,
    data,
  };
}
