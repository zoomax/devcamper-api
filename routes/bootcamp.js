const express = require("express");
const BootcampModel = require("../db/models/bootcamp");
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsByRadius,
} = require("../controllers/bootcamp");
const { getCourses, createCourse } = require("../controllers/course");
const advancedResponse = require("../middlewares/advancedResponse");
const responseHandler = require("../utils/responseHandler");
const authMiddleware = require("../middlewares/auth");
const { roleMiddleware } = require("../middlewares/roleMiddleware");

const router = express.Router();

router
  .route("/:id/courses")
  .get(getCourses, responseHandler)
  .post(createCourse, responseHandler);

router.route("/:zipcode/:distance").get(getBootcampsByRadius, responseHandler);

router
  .route("/:id")
  .get(getBootcamp, responseHandler)
  .put(
    authMiddleware,
    roleMiddleware("publisher", "admin"),
    updateBootcamp,
    responseHandler
  )
  .delete(
    authMiddleware,
    roleMiddleware("publisher", "admin"),
    deleteBootcamp,
    responseHandler
  );
router
  .route("/")
  .get(
    advancedResponse(BootcampModel, "courses"),
    getBootcamps,
    responseHandler
  )
  .post(
    authMiddleware,
    roleMiddleware("publisher", "admin"),
    createBootcamp,
    responseHandler
  );

module.exports = router;
