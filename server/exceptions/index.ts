import { INTERNAL_SERVER_ERROR } from "@constants/http-status";

export default class CustomError extends Error {
  message!: string;
  status!: number;

  constructor(
    message: string = "Internal Server Error",
    status: number = INTERNAL_SERVER_ERROR
  ) {
    super(message);
    this.status = status;
  }
}
