const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getCurrentUser,
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
//@access   public
router.route("/me").get(authMiddleware, getCurrentUser, responseHandler);

module.exports = router;
