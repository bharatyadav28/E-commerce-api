import express from "express";

import authentication from "../middlewares/authentication.js";
import authorizePermissions from "../middlewares/authorizePermissions.js";
import {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
} from "../controllers/orderController.js";

const router = express.Router();

router
  .route("/")
  .get(authentication, authorizePermissions("admin"), getAllOrders)
  .post(authentication, createOrder);
router.route("/showAllMyOrders").get(authentication, getCurrentUserOrders);
router
  .route("/:id")
  .get(authentication, getSingleOrder)
  .patch(authentication, updateOrder);

export default router;
