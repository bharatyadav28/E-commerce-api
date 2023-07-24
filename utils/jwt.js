import jwt from "jsonwebtoken";

const create_jwt = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    // expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};

const verify_token = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const attachCookiesToResponse = ({ res, user, refreshToken }) => {
  // console.log(tokenUser, refreshTokenJWT);
  const accessTokenJWT = create_jwt({ payload: { user } });
  const refreshTokenJWT = create_jwt({ payload: { user, refreshToken } });

  const maxTime = 1000 * 60 * 60 * 24 * 30;
  const minTime = 1000 * 60 * 60 * 24;

  res.cookie("accessToken", accessTokenJWT, {
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 20),
    signed: true,
    secure: process.env.NODE_ENV === "production",
  });
  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60),
    signed: true,
    secure: process.env.NODE_ENV === "production",
  });
};

export { create_jwt, attachCookiesToResponse, verify_token };
