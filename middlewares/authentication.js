import { UnauthenticatedError } from "../errors/index.js";
import { verify_token } from "../utils/index.js";

const authentication = (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  try {
    const payload = verify_token({ token });
    const { userId, name, role } = payload;
    req.user = { userId, name, role };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
};

export default authentication;
