import { StatusCodes } from "http-status-codes";

import UserModel from "../models/User.js";
import { attachCookiesToResponse, createTokenUser } from "../utils/index.js";
import { BadRequest, UnauthenticatedError } from "../errors/index.js";

// signup
const register = async (req, res) => {
  const { name, email, password } = req.body;

  const isFirstUser = (await UserModel.countDocuments()) === 0;
  const role = isFirstUser ? "admin" : "user";
  const user = await UserModel.create({ name, email, password, role });

  const tokenUser = createTokenUser({ user });

  const token = attachCookiesToResponse({ res, tokenUser });
  res.status(StatusCodes.CREATED).json({ user, token });
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
  const tokenUser = createTokenUser({ user });
  attachCookiesToResponse({ res, tokenUser });
  res.status(StatusCodes.OK).json({ msg: "Login Successfull" });
};

//logout
const logout = (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "logout" });
};

export { register, login, logout };
