import { StatusCodes } from "http-status-codes";

import ProductModel from "../models/Products.js";
import { BadRequest, NotFoundError } from "../errors/index.js";
import OrderModel from "../models/Order.js";
import { checkPermissions } from "../utils/index.js";

const fakeStripeApi = async ({ amount, currency }) => {
  const client_secret = "ThisIsClientSecret";
  return { client_secret, amount };
};

const getAllOrders = async (req, res) => {
  const orders = await OrderModel.find();

  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params;

  const order = await OrderModel.findOne({ _id: orderId });
  if (!order) {
    throw new NotFoundError(`No order with id ${orderId}`);
  }

  checkPermissions({ requestUser: req.user, resourceUserId: order.user });
  res.status(StatusCodes.OK).json({ order });
};

const getCurrentUserOrders = async (req, res) => {
  const currentUserId = req.user.userId;
  const orders = await OrderModel.find({ user: currentUserId });
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const createOrder = async (req, res) => {
  const { orderItems, tax, shippingFee } = req.body;

  if (!orderItems || orderItems.length < 1) {
    throw new BadRequest("No Items provided");
  }

  if (!tax || !shippingFee) {
    throw new BadRequest("please provide tax and shipping fee.");
  }

  let verifiedOrderItems = [];
  let subTotal = 0;

  for (let item of orderItems) {
    const product = await ProductModel.findOne({ _id: item.product });
    if (!product) {
      throw new NotFoundError(`Product with id ${item.product} doesnot exist.`);
    }
    const { name, image, price, _id: productId } = product;
    const singleOrderItem = {
      name,
      image,
      price,
      amount: item.amount,
      product: productId,
    };
    verifiedOrderItems = [...verifiedOrderItems, singleOrderItem];
    subTotal += price * item.amount;
  }

  const total = subTotal + tax + shippingFee;
  const paymentIntent = await fakeStripeApi({ amount: total, currency: "INR" });

  const order = await OrderModel.create({
    tax,
    shippingFee,
    subTotal,
    total,
    orderItems: verifiedOrderItems,
    user: req.user.userId,
    clientSecret: paymentIntent.client_secret,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret });
};

const updateOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const { paymentIntentId } = req.body;

  const order = await OrderModel.findOne({ _id: orderId });
  if (!order) {
    throw new NotFoundError(`Order with id ${orderId} doesnot exist.`);
  }
  checkPermissions({ requestUser: req.user, resourceUserId: order.user });
  order.paymentIntentId = paymentIntentId;
  order.status = "paid";
  await order.save();
  res.status(StatusCodes.OK).json({ order });
};

export {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
