import { StatusCodes } from "http-status-codes";

import ReviewModel from "../models/Review.js";
import ProductModel from "../models/Products.js";
import { BadRequest, NotFoundError } from "../errors/index.js";
import { checkPermissions } from "../utils/index.js";

const getAllReviews = async (req, res) => {
  const reviews = await ReviewModel.find()
    .populate({
      path: "product",
      select: "name price",
    })
    .populate({
      path: "user",
      select: "name email",
    });

  res.status(StatusCodes.OK).json(reviews);
};

const createReview = async (req, res) => {
  const { product: productId } = req.body;
  const isValidProduct = await ProductModel.findOne({ _id: productId });
  if (!isValidProduct) {
    throw new NotFoundError(`No product with id ${productId}`);
  }

  const alreadySubmitted = await ReviewModel.findOne({
    user: req.user.userId,
    product: productId,
  });
  if (alreadySubmitted) {
    throw new BadRequest("Already submitted review for this product");
  }
  req.body.user = req.user.userId;
  const review = await ReviewModel.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};

const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await ReviewModel.findOne({ _id: reviewId });
  if (!review) {
    throw new NotFoundError(`No review with id ${reviewId}`);
  }
  res.status(StatusCodes.OK).json(review);
};

const updateReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const { rating, title, comment } = req.body;

  const review = await ReviewModel.findOne({ _id: reviewId });

  if (!review) {
    throw new NotFoundError(`No review with id ${reviewId}`);
  }

  checkPermissions({ requestUser: req.user, resourceUserId: review.user });

  review.rating = rating;
  review.title = title;
  review.comment = comment;

  await review.save();
  res.status(StatusCodes.OK).json({ review });
};

const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;

  const review = await ReviewModel.findOne({ _id: reviewId });

  if (!review) {
    throw new NotFoundError(`No review with id ${reviewId}`);
  }

  checkPermissions({ requestUser: req.user, resourceUserId: review.user });
  await ReviewModel.deleteOne({ _id: reviewId });
  res.status(StatusCodes.OK).json({ msg: "Review deleted successfully." });
};

const getSingleProductReviews = async (req, res) => {
  const { id: productId } = req.params;
  const reviews = await ReviewModel.find({ product: productId });
  res.status(StatusCodes.OK).json({ reviews });
};

export {
  getAllReviews,
  createReview,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
};
