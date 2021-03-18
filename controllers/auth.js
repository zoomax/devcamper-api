const UserModel = require("../db/models/user");
const { response } = require("../utils/utils");
const sendEmail = require("../utils/mailSender");
const crypto = require("crypto");

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const user = new UserModel({ name, email, role, password });
    await user.save();
    return createTokenCookie(user, res, 201);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const loginUser = async function (req, res, next) {
  try {
    const { password, email } = req.body;
    if (password && email) {
      const user = await UserModel.findOne({ email }).select("+password");
      if (user) {
        const isPasswordMatch = await user.isPasswordMatch(password);
        if (isPasswordMatch) {
          return createTokenCookie(user, res, 200);
        }
      }
    }
    req.response = {
      statusCode: 400,
    };
    next();
  } catch (err) {
    next(err);
  }
};
const getCurrentUser = function (req, res, next) {
  const { user } = req;
  req.response = {
    data: [user],
    statusCode: 200,
  };
  next();
};

const forgotPassword = async function (req, res, next) {
  const { email } = req.body;
  if (!email) return next(new Error("please provide a valid email"));
  try {
    const user = await UserModel.findOne({ email });
    // generating a resetPasswordToken for a user
    const resetPasswordToken = user ? user.getResetPasswordToken() : "";
    if (user) {
      // saving all changes made to user object with the specified email
      await user.save({ validateBeforeSave: false });
      // creating a url for resetting the password
      const resetURL = `${req.protocol}://${req.get(
        "host"
      )}/api/v1/auth/reset-password/${resetPasswordToken}`;
      //sending the resetpassword token via mail
      await sendEmail({
        to: "hazem.hemily@gmail.com",
        text: `you're receiving this email because you (or somebody else) hsa requested the reset of the password,
               please add a PUT request to: \n\n ${resetURL}`,
        subject: "password rest token ",
      });
    }
    const userObj = Object.assign({}, user.toJSON());
    // passing response to the response handler middleware
    req.response = {
      statusCode: user ? 200 : 404,
      data: user ? [{ ...userObj, isMessageSent: true }] : [],
      resetPasswordToken: user ? resetPasswordToken : undefined,
    };
    return next();
  } catch (err) {
    return next(err);
  }
};

const resetPassword = async function (req, res, next) {
  const {
    params: { resetPasswordToken },
    body: { password },
  } = req;
  const decodedToken = crypto
    .createHash("sha256")
    .update(resetPasswordToken)
    .digest("hex"); // this functionality is used for both encodeing and decoding the token
  console.log(resetPasswordToken, password);
  try {
    const user = await UserModel.findOne({
      resetPasswordToken: decodedToken,
      resetPasswordExpiry: { $gt: Date.now() },
    });
    if (user) {
      user.password = password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpiry = undefined;
      await user.save();
    }

    req.response = {
      statusCode: user ? 203 : 404,
      data: user
        ? [{ ...user.toJSON(), message: "password was resetted successfully" }]
        : [],
    };
    return next();
  } catch (err) {
    return next(err);
  }
};

const updateUserDetails = async function (req, res, next) {
  const {
    user: { _id },
    body: { email, name },
  } = req;
  try {
    if (!name || !email)
      return next(new Error("please provide a valid data to be submitted"));
    const user = await UserModel.findByIdAndUpdate(
      _id,
      { email, name },
      { new: true }
    );
    req.response = {
      data: user
        ? [{ ...user.toJSON(), message: "record was updated successfully" }]
        : [],
      statusCode: user ? 203 : 404,
    };
    return next();
  } catch (err) {
    return next(err);
  }
};
const updateUserPassword = async function (req, res, next) {
  const {
    user: { _id },
    body: { password, newPassword },
  } = req;
  try {
    if (!password || !newPassword)
      return next(new Error("please provide a valid data to be submitted"));
    const user = await UserModel.findById(_id).select("+password");
    const isPasswordMatch = user ? user.isPasswordMatch(password) : false;
    if (isPasswordMatch) {
      user.password = newPassword;
      await user.save();
      return createTokenCookie(user, res, 200);
    }
    req.response = {
      statusCode: 400,
    };
    return next();
  } catch (err) {
    return next(err);
  }
};
const createTokenCookie = function (user, res, statusCode) {
  const token = user.getUserToken();
  const options = {
    httpOnly: false,
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRY * 24 * 60 * 60 * 1000
    ),
  };

  if (process.env.NODE_ENV === "proudction") {
    options.secure = true;
  }
  return res
    .status(200)
    .cookie("token", token, options)
    .json({
      ...response,
      statusCode,
      status: "OK",
      data: [user],
      token,
      count: 1,
      message:
        statusCode == 200
          ? "you've signed in successfully"
          : "a new user was created successfully",
    });
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  updateUserDetails,
  updateUserPassword,
};
