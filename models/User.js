import mongoose from "mongoose";
import validator from "validator";
import bcyrpt from "bcrypt";

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name."],
    trim: true,
    minLength: 3,
    maxLength: 50,
  },
  email: {
    type: String,
    required: [true, "Please provide email."],
    trim: true,
    validate: {
      validator: validator.isEmail,
      message: "Please provide valid email",
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password."],
    trim: true,
    minLength: 6,
  },
  role: {
    type: String,
    trim: true,
    enum: { values: ["user", "admin"], message: "{VALUE} is not supported." },
    default: "user",
  },
});

UserSchema.pre("save", async function () {
  // console.log(this.modifiedPaths());
  if (!this.isModified("password")) return;
  const salt = await bcyrpt.genSalt(Number(process.env.SALT_ROUNDS));
  this.password = await bcyrpt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (candidiatePassword) {
  const isMatch = await bcyrpt.compare(candidiatePassword, this.password);
  return isMatch;
};

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
