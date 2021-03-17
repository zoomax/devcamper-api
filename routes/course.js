const { Router } = require("express");
const {
  getCourses,
  deleteCourseById,
  updateCourseById,
  createCourse,
  getCourseById,
} = require("../controllers/course");
const CourseModel = require("../db/models/course");
const advancedResponse = require("../middlewares/advancedResponse");
const responseHandler = require("../utils/responseHandler");

const router = Router();

router
  .route("/")
  .get(getCourses, advancedResponse(CourseModel), responseHandler);

router
  .route("/:courseId")
  .get(getCourseById, responseHandler)
  .delete(deleteCourseById, responseHandler)
  .put(updateCourseById, responseHandler);

module.exports = router;
