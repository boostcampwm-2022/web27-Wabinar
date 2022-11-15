import CustomError from '.';
import { BAD_REQUEST } from '@constants/http-status';

class InvalidJoinError extends CustomError {
  constructor(message = 'Unauthorized') {
    super(message, BAD_REQUEST);
  }
}

export default InvalidJoinError;
