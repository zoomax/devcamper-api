const express = require("express");
const router = express.Router();
const advancedResponse = require("../middlewares/advancedResponse");
const { roleMiddleware } = require("../middlewares/roleMiddleware");
const UserModel = require("../db/models/user");
const responseHandler = require("../utils/responseHandler");
const authMiddleware = require("../middlewares/auth");
const {
  getUserById,
  getUsers,
  deleteUser,
  updateUser,
  createUser,
} = require("../controllers/user");

router
  .route("/")
  .get(
    authMiddleware,
    roleMiddleware("admin"),
    advancedResponse(UserModel),
    getUsers,
    responseHandler
  )
  .post(authMiddleware, roleMiddleware("admin"), createUser, responseHandler);

router
  .route("/:id")
  .get(authMiddleware, roleMiddleware("admin"), getUserById, responseHandler)
  .put(authMiddleware, roleMiddleware("admin"), updateUser, responseHandler)
  .delete(authMiddleware, roleMiddleware("admin"), deleteUser, responseHandler);

module.exports = router;
