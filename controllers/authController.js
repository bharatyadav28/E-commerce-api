import { StatusCodes } from "http-status-codes";
import crypto from "crypto";

import UserModel from "../models/User.js";
import {
  attachCookiesToResponse,
  createTokenUser,
  sendVerificationEmail,
  sendResetPasswordEmail,
  createHash,
} from "../utils/index.js";
import {
  BadRequest,
  NotFoundError,
  UnauthenticatedError,
} from "../errors/index.js";
import TokenModel from "../models/Token.js";

// signup
const register = async (req, res) => {
  const { name, email, password } = req.body;

  const verificationToken = crypto.randomBytes(40).toString("hex");

  const isFirstUser = (await UserModel.countDocuments()) === 0;
  const role = isFirstUser ? "admin" : "user";
  const user = await UserModel.create({
    name,
    email,
    password,
    role,
    verificationToken,
  });

  // const origin = "http://localhost:3000";

  const forwardedProtocol = req.get("x-forwarded-proto");
  const forwardedHost = req.get("x-forwarded-host");
  const origin = `${forwardedProtocol}://${forwardedHost}`;

  // console.log(req);

  await sendVerificationEmail({ name, email, verificationToken, origin });

  res.status(StatusCodes.CREATED).json({ user });
};

const verifyEmail = async (req, res) => {
  const { email, verificationToken } = req.body;
  const user = await UserModel.findOne({ email: email });
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  if (!(user.verificationToken === verificationToken)) {
    throw new UnauthenticatedError("verfication token is invalid");
  }

  user.isVerified = true;
  user.verified = Date.now();
  user.verificationToken = "";
  user.save();

  res.status(StatusCodes.OK).json({ msg: "verificaton of email successfull." });
};

//login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequest("Please provide email and password");
  }

  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  if (!user.isVerified) {
    throw new UnauthenticatedError("Please verify the email before logging in");
  }

  const tokenUser = createTokenUser({ user });

  let refreshToken = "";

  // refresh token already exists
  const existingToken = await TokenModel.findOne({ user: user._id });
  if (existingToken) {
    if (!existingToken.isValid) {
      throw new UnauthenticatedError("Invalid Credentials");
    }
    refreshToken = existingToken.refreshToken;

    attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    return res.status(StatusCodes.OK).json({ msg: "Login Successfull" });
  }

  // create new token
  refreshToken = crypto.randomBytes(40).toString("hex");

  const userAgent = req.headers["user-agent"];
  const ip = req.ip;
  await TokenModel.create({ refreshToken, userAgent, ip, user: user._id });

  attachCookiesToResponse({ res, user: tokenUser, refreshToken });
  res.status(StatusCodes.OK).json({ msg: "Login Successfull" });
};

//logout
const logout = async (req, res) => {
  await TokenModel.findOneAndDelete({ user: req.user.userId });

  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({ msg: "logout" });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new BadRequest("Please provide email.");
  }

  const user = await UserModel.findOne({ email });
  if (user) {
    const passwordToken = crypto.randomBytes(70).toString("hex");
    const forwardedProtocol = req.get("x-forwarded-proto");

    const forwardedHost = req.get("x-forwarded-host");
    const origin = `${forwardedProtocol}://${forwardedHost}`;

    await sendResetPasswordEmail({
      name: user.name,
      email: user.email,
      passwordToken,
      origin,
    });

    const tenMinutes = 1000 * 60 * 10;
    const passwordTokenExpirationDate = Date.now() + tenMinutes;

    user.passwordToken = createHash(passwordToken);

    user.passwordTokenExpirationDate = passwordTokenExpirationDate;
    user.save();
  }

  res
    .status(StatusCodes.OK)
    .json({ msg: "Please check your email for reset password link" });
};

const resetPassword = async (req, res) => {
  const { email, token, password } = req.body;
  if (!token || !email || !password) {
    throw new CustomError.BadRequestError("Please provide all values");
  }

  const user = await UserModel.findOne({
    email: email,
    passwordToken: createHash(token),
  });

  if (!user) {
    throw new NotFoundError("Something went wrong");
  }
  if (user.passwordTokenExpirationDate <= new Date(Date.now())) {
    throw new NotFoundError("link expired");
  }
  user.password = password;
  user.passwordToken = null;
  user.passwordTokenExpirationDate = null;

  await user.save();

  res.status(StatusCodes.OK).json({ msg: "Password reset successfull" });
};

export { register, verifyEmail, login, logout, forgotPassword, resetPassword };
