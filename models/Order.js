import mongoose from "mongoose";

const SingleOrderItemsSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  product: {
    type: mongoose.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});

const OrderSchema = mongoose.Schema(
  {
    tax: {
      type: Number,
      required: [true, "Please provide tax"],
    },
    shippingFee: {
      type: Number,
      required: [true, "Please provide shippingFee"],
    },
    subTotal: {
      type: Number,
      required: [true, "Please provide subtotal"],
    },
    total: {
      type: Number,
      required: [true, "Please provide total"],
    },
    orderItems: [SingleOrderItemsSchema],
    status: {
      type: String,
      enum: ["pending", "failed", "paid", "delivered", "cancelled"],
      default: "pending",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      requires: true,
    },
    clientSecret: {
      type: String,
      required: true,
    },
    paymentIntentId: {
      type: String,
    },
  },
  {
    timeStamps: true,
  }
);

const OrderModel = mongoose.model("Order", OrderSchema);

export default OrderModel;
