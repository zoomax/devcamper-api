const UserModel = require("../db/models/user");
const { response } = require("../utils/utils");

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
      token , 
      count: 1,
      message:
        statusCode == 200
          ? "you've signed in successfully"
          : "a new user was created successfully",
    });
};

const getCurrentUser = function (req, res, next) {
  const { user } = req;
  req.response = {
    data: [user],
    statusCode: 200,
  };
  next();
};
module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
};
