import { UnauthenticatedError } from "../errors/index.js";
import { attachCookiesToResponse, verify_token } from "../utils/index.js";
import TokenModel from "../models/Token.js";

const authentication = async (req, res, next) => {
  const { accessToken, refreshToken } = req.signedCookies;

  try {
    if (accessToken) {
      const payload = verify_token(accessToken);
      req.user = payload.user;
      return next();
    }

    const payload = verify_token(refreshToken);

    const existingToken = await TokenModel.findOne({
      user: payload.user.userId,
      refreshToken: payload.refreshToken,
    });

    if (!existingToken || !existingToken.isValid) {
      throw new UnauthenticatedError("Authentication Invalid");
    }

    attachCookiesToResponse({
      res,
      user: payload.user,
      refreshToken: payload.refreshToken,
    });

    req.user = payload.user;
    next();
  } catch (error) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
};

export default authentication;
