import { HttpException } from '@nestjs/common';
import { HttpStatusCode } from '../constant/http-status.constant';
import { apiResponseType } from './../constant/response-type';

export function apiError(
  error: unknown,
  status?: HttpStatusCode,
  message?: string,
): apiResponseType<null> {
  // always returns data: null
  let errMsg = message || 'Internal Server Error';
  let errStatus = status || HttpStatusCode.INTERNAL_SERVER_ERROR;

  if (error instanceof HttpException) {
    errMsg = error.message;
    errStatus = error.getStatus();
  }

  console.error(error); // log for debugging

  return {
    message: errMsg,
    status: errStatus,
    data: null,
  };
}
