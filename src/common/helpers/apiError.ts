import { HttpException } from '@nestjs/common';
import { HttpStatusCode } from '../constant/http-status.constant';
import { apiResponseType } from './../constant/response-type';

// Prisma error type (partial)
interface PrismaError {
  code?: string;
  meta?: {
    target?: string[];
  };
  message?: string;
}

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

  // Prisma duplicate entry handling
  if (error && typeof error === 'object' && 'code' in error) {
    const errObj = error as PrismaError;

    // Prisma unique constraint violation
    if (errObj.code === 'P2002') {
      const targetColumns = errObj.meta?.target || [];
      errMsg = `Duplicate entry detected on column(s): ${targetColumns.join(', ')}`;
      errStatus = HttpStatusCode.BAD_REQUEST;
    }
  }

  console.error(error); // log for debugging

  return {
    message: errMsg,
    status: errStatus,
    data: null,
  };
}
