import CustomError from '.';
import { UNAUTHORIZED } from '@constants/http-status';

export default class AuthorizationError extends CustomError {
  constructor(message = 'Unauthorized') {
    super(message, UNAUTHORIZED);
  }
}
