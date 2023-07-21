import mongoose from "mongoose";

const ReviewSchema = mongoose.Schema({
  rating: {
    type: Number,
    required: [true, "Please provide rating"],
    min: 1,
    max: 5,
  },
  title: {
    type: String,
    required: [true, "please provide title"],
    trim: true,
    maxLength: 100,
  },
  comment: {
    type: String,
    required: [true, "please provide review text"],
    trim: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  product: {
    type: mongoose.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});
ReviewSchema.index({ user: 1, product: 1 }, { unique: true });

ReviewSchema.statics.aggregateResult = async function (productId) {
  const result = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);

  const product = await this.model("Product").findOne({ _id: productId });
  console.log(product);
  product.averageRating = Math.ceil(result[0]?.averageRating || 0);
  product.numOfReviews = result[0]?.numOfReviews || 0;
  await product.save();
  console.log(product.averageRating);
};

ReviewSchema.post("save", async function () {
  // console.log("After saving review");
  // console.log("Product Id", this.product);
  await this.constructor.aggregateResult(this.product);
});

ReviewSchema.post("deleteOne", async function () {
  // console.log("After deleting review");
  // console.log("Product Id", this.product);
  await this.constructor.aggregateResult(this.product);
});

const ReviewModel = mongoose.model("Review", ReviewSchema);

export default ReviewModel;

// // here 'this' refers to query not document
// ReviewSchema.post("deleteOne", async function (result, next) {
//   console.log("After deleting product");
//   // console.log("Product Id", this._conditions.product);
//   // Access the _id of the document being deleted
//   const deletedId = this._conditions._id;
//   console.log(deletedId);
//   const doc = await this.model.findOne({ _id: deletedId });
//   console.log(doc);
//   await this.model.aggregateResult(doc.product);
// });
