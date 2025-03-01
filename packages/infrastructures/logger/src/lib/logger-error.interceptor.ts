import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class LoggerErrorInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError((error) => {
        return throwError(() => {
          const response = context.switchToHttp().getResponse();

          const isFastifyResponse = response.raw !== undefined;

          if (isFastifyResponse) {
            response.raw.err = error;
          } else {
            response.err = error;
          }

          return error;
        });
      })
    );
  }
}
