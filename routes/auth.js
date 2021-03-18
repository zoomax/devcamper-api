const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  updateUserDetails,
  updateUserPassword,
} = require("../controllers/auth");
const responseHandler = require("../utils/responseHandler");
const authMiddleware = require("../middlewares/auth");

//@route    POST api/v1/auth/register
//@dec      create a new user
//@access   public
router.route("/register").post(registerUser, responseHandler);

//@route    POST api/v1/auth/login
//@dec      sign in user
//@access   public
router.route("/login").post(loginUser, responseHandler);

//@route    POST api/v1/auth/login
//@dec      sign in user
//@access   private
router.route("/me").get(authMiddleware, getCurrentUser, responseHandler);
//@route    POST api/v1/auth/forget-password
//@dec      generate a rest-password-token
//@access   public
router.route("/forgot-password").put(forgotPassword, responseHandler);

//@route    POST api/v1/auth/forget-password
//@dec      generate a rest-password-token
//@access   public
router.route("/reset-password/:resetPasswordToken").put(resetPassword, responseHandler);
//@route    POST api/v1/auth/me/update-details
//@dec      updating user's email and name
//@access   private
router.route("/me/update-details").put(authMiddleware, updateUserDetails, responseHandler);
//@route    POST api/v1/auth/me/update-details
//@dec      updating user's password
//@access   private
router.route("/me/update-password").put(authMiddleware, updateUserPassword, responseHandler);


module.exports = router;
