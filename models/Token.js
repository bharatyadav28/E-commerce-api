import mongoose from "mongoose";

const TokenSchema = mongoose.Schema(
  {
    refreshToken: {
      type: String,
      require: true,
    },
    ip: {
      type: String,
      require: true,
    },
    userAgent: {
      type: String,
      require: true,
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timeStamps: true,
  }
);

const TokenModel = mongoose.model("Token", TokenSchema);

export default TokenModel;
