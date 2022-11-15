import CustomError from ".";
import { BAD_REQUEST } from "@constants/http-status";

export default class InvalidJoinError extends CustomError {
  constructor(message: string = "Unauthorized") {
    super(message, BAD_REQUEST);
  }
}
