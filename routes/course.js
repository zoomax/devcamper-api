const { Router } = require("express");
const {
  getCourses,
  deleteCourseById,
  updateCourseById,
  createCourse,
  getCourseById,
} = require("../controllers/course");
const responseHandler = require("../utils/responseHandler");

const router = Router();

router
  .route("/")
  .get(getCourses, responseHandler)
  
router
  .route("/:courseId")
  .get(getCourseById, responseHandler)
  .delete(deleteCourseById, responseHandler)
  .put(updateCourseById, responseHandler);

module.exports = router;
