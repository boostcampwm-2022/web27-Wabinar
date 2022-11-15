import CustomError from ".";
import { UNAUTHORIZED } from "@constants/http-status";

export default class AuthorizationError extends CustomError {
  constructor(message: string = "Unauthorized") {
    super(message, UNAUTHORIZED);
  }
}
