import { INTERNAL_SERVER_ERROR } from '@constants/http-status';

class CustomError extends Error {
  message!: string;
  status!: number;

  constructor(
    message = 'Internal Server Error',
    status: number = INTERNAL_SERVER_ERROR,
  ) {
    super();

    this.message = message;
    this.status = status;
  }
}

export default CustomError;
