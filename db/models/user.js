const { Schema, model } = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "this field is required"],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "this field is required"],
    match: [
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
      "please add a valid email",
    ],
  },
  role: {
    type: String,
    enum: ["publisher", "user"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "this field is required"],
    minlength: [6, "password must be at least 6 characters long"],
    select: false,
  },
  craetedAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpiry: {
    type: Date,
  },
});
UserSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.methods.getUserToken = function () {
  // this is a user instance method
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
  return token;
};

UserSchema.methods.isPasswordMatch = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    console.err(err);
    return false
  }
};
module.exports = model("user", UserSchema);
