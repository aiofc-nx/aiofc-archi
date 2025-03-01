import { RESPONSE_SUCCESS_CODE, RESPONSE_SUCCESS_MSG } from '@aiofc/constants';
import { ApiProperty } from '@nestjs/swagger';

export class ApiRes<T> {
  static success<T>(
    data: T,
    message: string = RESPONSE_SUCCESS_MSG
  ): ApiRes<T> {
    return new ApiRes(RESPONSE_SUCCESS_CODE, data, message);
  }

  static ok(): ApiRes<null> {
    return new ApiRes(RESPONSE_SUCCESS_CODE, null, RESPONSE_SUCCESS_MSG);
  }

  static error(message: string, code = 500): ApiRes<null> {
    return new ApiRes(code, null, message);
  }

  static custom<T>(code: number, data: T, message: string): ApiRes<T> {
    return new ApiRes(code, data, message);
  }

  @ApiProperty({ description: 'data' })
  data?: T;

  @ApiProperty({
    type: 'number',
    default: RESPONSE_SUCCESS_CODE,
    description: 'code',
  })
  code: number;

  @ApiProperty({
    type: 'string',
    default: RESPONSE_SUCCESS_MSG,
    description: 'message',
  })
  message: string;

  private constructor(
    code: number,
    data: T,
    message: string = RESPONSE_SUCCESS_MSG
  ) {
    this.code = code;
    this.data = data;
    this.message = message;
  }
}
