import CustomError from '.';
import { FORBIDDEN } from '@constants/http-status';

class ForbiddenError extends CustomError {
  constructor(message = 'Forbidden') {
    super(message, FORBIDDEN);
  }
}

export default ForbiddenError;
