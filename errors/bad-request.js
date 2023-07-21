import { StatusCodes } from "http-status-codes";

import CustomApiError from "./custom-errors.js";

// class BadRequest extends CustomApiError {
//   constructor(message) {
//     super(message);
//     this.statusCode = StatusCodes.BAD_REQUEST;
//   }
// }
class BadRequest extends CustomApiError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

export default BadRequest;
