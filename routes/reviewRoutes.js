import express from "express";

import authentication from "../middlewares/authentication.js";

import {
  getAllReviews,
  createReview,
  getSingleReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";

const router = express.Router();

router.route("/").get(getAllReviews).post(authentication, createReview);
router
  .route("/:id")
  .get(getSingleReview)
  .patch(authentication, updateReview)
  .delete(authentication, deleteReview);

export default router;
