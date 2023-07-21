import { StatusCodes } from "http-status-codes";
import path, { dirname } from "path";
import url from "url";

import ProductModel from "../models/Products.js";
import { BadRequest, NotFoundError } from "../errors/index.js";

const getAllProducts = async (req, res) => {
  const products = await ProductModel.find();
  res.status(StatusCodes.OK).json({ products, count: products.length });
};

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await ProductModel.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};

const getSingleProduct = async (req, res) => {
  const productId = req.params.id;
  const product = await ProductModel.findOne({ _id: productId }).populate({
    path: "reviews",
  });
  if (!product) {
    throw new NotFoundError(`No product with id ${productId}`);
  }
  res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await ProductModel.findOneAndUpdate(
    { _id: productId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!product) {
    throw new NotFoundError(`No product with id ${productId}`);
  }
  res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;
  // const product = await ProductModel.findOneAndDelete({ _id: productId });
  const product = await ProductModel.findOne({ _id: productId });

  if (!product) {
    throw new NotFoundError(`No product with id ${productId}`);
  }
  await product.deleteOne({ _id: productId });

  res.status(StatusCodes.OK).json({ msg: "Product removed successfully." });
};

const uploadImage = async (req, res) => {
  //   console.log(req.files);
  if (!req.files) {
    throw new BadRequest("No File Uploaded");
  }
  const productImage = req.files.image;
  if (!productImage.mimetype.startsWith("image")) {
    throw new BadRequest("Please Upload Image");
  }
  const maxImageSize = 4000000;
  if (productImage.size > maxImageSize) {
    throw new BadRequest(`Image size should not be more than ${maxImageSize}`);
  }

  const __filename = url.fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const imagePath = path.join(
    __dirname,
    "../public/uploads/",
    productImage.name
  );

  await productImage.mv(imagePath);
  res.status(StatusCodes.OK).json({ image: `uploads/${productImage.name}` });
};

export {
  getAllProducts,
  createProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
