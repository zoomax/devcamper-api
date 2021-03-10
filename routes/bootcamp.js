const express = require("express");
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsByRadius,
  getBootcampCourses,
} = require("../controllers/bootcamp");
const { getCourses, createCourse } = require("../controllers/course");
const responseHandler = require("../utils/responseHandler");

const router = express.Router();

router
  .route("/:id/courses")
  .get(getCourses, responseHandler)
  .post(createCourse, responseHandler);
  
router
  .route("/")
  .get(getBootcamps, responseHandler)
  .post(createBootcamp, responseHandler);

router.route("/:zipcode/:distance").get(getBootcampsByRadius, responseHandler);

router
  .route("/:id")
  .get(getBootcamp, responseHandler)
  .put(updateBootcamp, responseHandler)
  .delete(deleteBootcamp, responseHandler);

module.exports = router;
