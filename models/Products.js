import mongoose from "mongoose";

const ProductSchema = mongoose.Schema(
  {
    name: {
      type: "String",
      required: [true, "Please provide product name."],
      trim: true,
      maxLength: [100, "Name can not be more than 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please provide price"],
      trim: true,
      default: 0,
    },
    description: {
      type: "String",
      required: [true, "Please provide product description."],
      trim: true,
      maxLength: [1000, "Description can not be more than 1000 characters"],
    },
    image: {
      type: "String",
      required: [true, "Please provide image."],
      default: "/uploads/example.jpeg",
    },
    cateogry: {
      type: "String",
      required: [true, "Please provide product cateogry."],
      enum: {
        values: ["office", "kitchen", "bedroom"],
        message: "{VALUE} is not supported.",
      },
    },
    company: {
      type: "String",
      required: [true, "Please provide company."],
      enum: {
        values: ["ikea", "liddy", "marcos"],
        message: "{VALUE} is not supported.",
      },
      //   enum: ["ikea", "liddy", "marcos"],
    },
    colors: {
      type: ["String"],
      required: [true, "Please provide color."],
      default: ["#222"],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: true,
      default: 15,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user."],
    },
  },
  {
    timeStamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
  }
);
ProductSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
  justOne: false,
});

ProductSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function () {
    await this.model("Review").deleteMany({ product: this._id });
  }
);

const ProductModel = mongoose.model("Product", ProductSchema);

export default ProductModel;
