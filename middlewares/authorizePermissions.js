import { UnauthorizedError } from "../errors/index.js";

const authorizePermissions = (...roles) => {
  // console.log(roles);
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError(
        "You are not authorized to access this route"
      );
    }
    next();
  };
};

export default authorizePermissions;
