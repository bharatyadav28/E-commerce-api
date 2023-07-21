import express from "express";

import {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} from "../controllers/userController.js";
import authentication from "../middlewares/authentication.js";
import authorizePermissions from "../middlewares/authorizePermissions.js";

const router = express.Router();

router
  .route("/")
  .get(authentication, authorizePermissions("admin"), getAllUsers);
router.route("/showMe").get(authentication, showCurrentUser);
router.route("/updateUser").patch(authentication, updateUser);
router.route("/updateUserPassword").patch(authentication, updateUserPassword);
router.route("/:id").get(authentication, getSingleUser);

export default router;
