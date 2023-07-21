import { UnauthorizedError } from "../errors/index.js";

const checkPermissions = ({ requestUser, resourceUserId }) => {
  if (requestUser.role === "admin") return;
  //   console.log(typeof resourceUserId, typeof resourceUserId.toString());
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new UnauthorizedError("Not authorized to access this resource.");
};

export default checkPermissions;
