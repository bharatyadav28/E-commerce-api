import express from "express";

import authentication from "../middlewares/authentication.js";
import authorizePermissions from "../middlewares/authorizePermissions.js";
import {
  getAllProducts,
  createProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} from "../controllers/productController.js";
import { getSingleProductReviews } from "../controllers/reviewController.js";

const router = express.Router();

router
  .route("/")
  .get(getAllProducts)
  .post(authentication, authorizePermissions("admin"), createProduct);
router
  .route("/uploadImage")
  .post(authentication, authorizePermissions("admin"), uploadImage);
router
  .route("/:id")
  .get(getSingleProduct)
  .patch(authentication, authorizePermissions("admin"), updateProduct)
  .delete(authentication, authorizePermissions("admin"), deleteProduct);

router.route("/:id/reviews").get(getSingleProductReviews);

export default router;
