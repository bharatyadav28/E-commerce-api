import { StatusCodes } from "http-status-codes";

import CustomApiError from "./custom-errors.js";

class NotFoundError extends CustomApiError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

export default NotFoundError;
