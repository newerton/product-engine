import { Catch, HttpStatus, RpcExceptionFilter } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { AppException, JoiValidationException } from 'src/app.exceptions';
import { QueryFailedError } from 'typeorm';

type ErrorProps = {
  statusCode: number;
  error: string;
  message: string;
  details: Array<{ [key: string]: any }>;
};

@Catch()
export class AppExceptionFilter implements RpcExceptionFilter {
  catch(exception: any): Observable<any> {
    console.log(exception);
    let json = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
      message: 'Internal Server Error',
      details: [],
    };

    if (
      exception instanceof AppException &&
      exception.constructor.name !== 'JoiValidationException'
    ) {
      const error = exception.getError() as ErrorProps;
      json = error;
    } else if (exception instanceof JoiValidationException) {
      const error = exception.getError() as ErrorProps;
      json.statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
      json.error = JoiValidationException.name;
      json.message = error.message;
      json.details = error.details;
    } else if (exception instanceof QueryFailedError) {
      json.statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
      json.message = exception.message;
    } else {
      json.message = exception.message;
    }

    return throwError(() => JSON.stringify(json));
  }
}
