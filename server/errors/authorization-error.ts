import CustomError from '.';
import { UNAUTHORIZED } from '@constants/http-status';

class AuthorizationError extends CustomError {
  constructor(message = 'Unauthorized') {
    super(message, UNAUTHORIZED);
  }
}

export default AuthorizationError;
