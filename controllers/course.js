const CourseModel = require("../db/models/course");
const BootcampModel = require("../db/models/bootcamp");

//@route    GET /courses
//@desc     get all courses
//@access   Public
const getCourses = async (req, res, next) => {
  const { id } = req.params;
  console.log(id, "from course controller");
  try {
    if (!id) return next();
    const courses = await CourseModel.find({ bootcamp: id }).populate(
      "bootcamp",
      "name description"
    );
    req.response = {
      statusCode: courses.length > 0 ? 200 : 404,
      data: courses.length > 0 ? courses : [],
    };

    next();
  } catch (err) {
    next(err);
  }
};

//@route    GET /courses/:courseId
//@desc     get course by id
//@access   Public
const getCourseById = async function (req, res, next) {
  const { courseId } = req.params;
  try {
    const course = await CourseModel.findById(courseId).populate("bootcamp");
    req.response = {
      statusCode: course ? 200 : 404,
      data: course ? [course] : [],
    };
    next();
  } catch (err) {
    next(err);
  }
};
//@route    DELETE/courses/:courseId
//@desc     delete course by id
//@access   Public
const deleteCourseById = async function (req, res, next) {
  const { courseId } = req.params;
  const {
    user: { _id },
  } = req;

  try {
    const course = await CourseModel.findById(courseId);
    const bootcamp = course
      ? await BootcampModel.findById(course.bootcamp)
      : null;
    const isOwner = bootcamp && _id.toString() === bootcamp.user.toString();
    if (isOwner) {
      await course.remove();
      req.response = {
        statusCode: 202,
        data: [course],
      };
    } else {
      req.response = {
        statusCode: course ? 401 : 404,
      };
    }
    return next();
  } catch (err) {
    next(err);
  }
};

//@route    PUT /courses/:courseId
//@desc     update course by id
//@access   Public
const updateCourseById = async function (req, res, next) {
  const { body } = req;
  const { courseId } = req.params;
  const {
    user: { _id },
  } = req;

  try {
    const course = await CourseModel.findById(courseId);
    const bootcamp = course
      ? await BootcampModel.findById(course.bootcamp)
      : null;
    const isOwner = bootcamp && _id.toString() === bootcamp.user.toString();
    if (isOwner) {
      const course = await CourseModel.findByIdAndUpdate(
        courseId,
        { ...body },
        {
          new: true,
        }
      ).populate("bootcamp");
      req.response = {
        statusCode: 203,
        data: [course],
      };
    } else {
      req.response = {
        statusCode: course ? 401 : 404,
      };
    }
    return next();
  } catch (err) {
    next(err);
  }
};
//@route    POST /courses/
//@desc     create new Course
//@access   Public
const createCourse = async function (req, res, next) {
  const {
    body,
    params: { id },
    user: { _id },
  } = req;
  try {
    const bootcamp = await BootcampModel.findById(id);
    const isOwner = bootcamp && _id.toString() === bootcamp.user.toString();
    if (isOwner) {
      const course = new CourseModel({ ...body, bootcamp: id });
      await course.save();
      req.response = {
        statusCode: 201,
        data: [course],
      };
    }
    req.response = {
      statusCode: bootcamp ? 401 : 404,
    };
    return next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCourses,
  createCourse,
  deleteCourseById,
  updateCourseById,
  getCourseById,
};
