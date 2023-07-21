import { StatusCodes } from "http-status-codes";

import UserModel from "../models/User.js";
import {
  NotFoundError,
  BadRequest,
  UnauthenticatedError,
} from "../errors/index.js";
import {
  attachCookiesToResponse,
  createTokenUser,
  checkPermissions,
} from "../utils/index.js";

const getAllUsers = async (req, res) => {
  const users = await UserModel.find().select("-password");
  console.log(req.user);
  return res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
  const user = await UserModel.findOne({ _id: req.params.id }).select(
    "-password"
  );
  if (!user) {
    throw new NotFoundError(`User with ${req.params.id} doesnot exist `);
  }
  checkPermissions({ requestUser: req.user, resourceUserId: user._id });

  return res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = (req, res) => {
  const user = req.user;
  return res.status(StatusCodes.OK).json({ user });
};

// using findOneAndUpdate()
// const updateUser = async (req, res) => {
//   const { name, email } = req.body;
//   if (!name || !email) {
//     throw new BadRequest("Please provide both values");
//   }
//   const userId = req.user.userId;
//   const user = await UserModel.findOneAndUpdate(
//     { _id: userId },
//     { name, email },
//     { new: true, runValidators: true }
//   );
//   const tokenUser = createTokenUser({ user });

//   attachCookiesToResponse({ res, tokenUser });
//   return res.status(StatusCodes.OK).json({ user: tokenUser });
// };

// using save()
const updateUser = async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    throw new BadRequest("Please provide both values");
  }
  const userId = req.user.userId;
  const user = await UserModel.findOne({ _id: userId });
  user.name = name;
  user.email = email;

  await user.save();
  const tokenUser = createTokenUser({ user });

  attachCookiesToResponse({ res, tokenUser });
  return res.status(StatusCodes.OK).json({ user: tokenUser });
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new BadRequest("Please provide both old password and new password.");
  }
  const user = await UserModel.findOne({ _id: req.user.userId });
  const IsOldPasswordCorrect = await user.comparePassword(oldPassword);
  if (!IsOldPasswordCorrect) {
    throw new UnauthenticatedError("Old password is not correct.");
  }
  user.password = newPassword;
  await user.save();

  return res.status(StatusCodes.OK).json("Password updated successfully");
};

export {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
