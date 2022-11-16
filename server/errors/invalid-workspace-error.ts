import CustomError from '.';
import { BAD_REQUEST } from '@constants/http-status';

class InvalidWorkspaceError extends CustomError {
  constructor(message = 'Unauthorized') {
    super(message, BAD_REQUEST);
  }
}

export default InvalidWorkspaceError;
