import { StatusCodes } from "http-status-codes";

import CustomApiError from "../errors/custom-errors.js";

const errorHandlerMiddleware = (error, req, res, next) => {
  //  Handle all the errors thrown explicitly using throw
  const customError = {
    message: error.message || "Internal Server error",
    statusCode: error.statusCode || 500,
  };

  //  Mongoose validation errors like any required value not entered.
  if (error.name === "ValidationError") {
    customError.message = Object.values(error.errors)
      .map((item) => item.message)
      .join(",");
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  // Email(unique values) entered again
  if (error.code && error.code === 11000) {
    customError.message = `Duplicate value entered for ${Object.keys(
      error.keyValue
    )}`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  //  format of _id is not correct
  if (error.name === "CastError") {
    customError.message = `No item found with id  ${error.value}`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }

  return res.status(customError.statusCode).json({ msg: customError.message });
};

export default errorHandlerMiddleware;
