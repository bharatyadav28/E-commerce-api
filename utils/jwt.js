import jwt from "jsonwebtoken";

const create_jwt = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};

const verify_token = ({ token }) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const attachCookiesToResponse = ({ res, tokenUser }) => {
  const token = create_jwt({ payload: tokenUser });
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    signed: true,
    secure: process.env.NODE_ENV === "production",
  });
};

export { create_jwt, attachCookiesToResponse, verify_token };
