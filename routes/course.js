const { Router } = require("express");
const {
  deleteCourseById,
  updateCourseById,
  createCourse,
  getCourseById,
} = require("../controllers/course");
const CourseModel = require("../db/models/course");
const advancedResponse = require("../middlewares/advancedResponse");
const responseHandler = require("../utils/responseHandler");
const authMiddleware = require("../middlewares/auth");
const {roleMiddleware} = require("../middlewares/roleMiddleware");

const router = Router();

router
  .route("/")
  .get(advancedResponse(CourseModel), responseHandler)
  

router
  .route("/:courseId")
  .get(getCourseById, responseHandler)
  .delete(
    authMiddleware,
    roleMiddleware("publisher", "admin"),
    deleteCourseById,
    responseHandler
  )
  .put(
    authMiddleware,
    roleMiddleware("publisher", "admin"),
    updateCourseById,
    responseHandler
  ).post(
    authMiddleware,
    roleMiddleware("publisher", "admin"),
    createCourse,
    responseHandler
  );


module.exports = router;
