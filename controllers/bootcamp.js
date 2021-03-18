const BootcampModel = require("../db/models/bootcamp");
const path = require("path");
const CourseModel = require("../db/models/course");
const geocoder = require("../utils/geocoder");
const { findByIdAndUpdate } = require("../db/models/bootcamp");
// router  "/api/v1/bootcamps/"
// method  GET all bootcapms
// access  Public
const getBootcamps = async function (req, res, next) {
  try {
    next();
  } catch (error) {
    next(error);
  }
};
// router  "/api/v1/bootcamps/:id"
// method  GET single bootcapm by id
// access  Public
const getBootcamp = async (req, res, next) => {
  try {
    let { id } = req.params;
    const bootcamp = await BootcampModel.findById(id)
      .populate("courses", "title description tuition")
      .populate("user");
    // console.log(bootcamp);
    req.response = {
      data: bootcamp ? [bootcamp] : [],
      statusCode: bootcamp ? 200 : 404,
    };
    next();
  } catch (error) {
    next(error);
  }
};
// router  "/api/v1/bootcamps/"
// method  GET all bootcapms
// access  Private
const createBootcamp = async (req, res, next) => {
  const body = req.body;
  // console.log(body);
  try {
    const publisherBootcampsCount = await BootcampModel.find({
      user: req.user._id,
    }).countDocuments();
    if (publisherBootcampsCount == 0) {
      const bootcamp = new BootcampModel({ ...body, user: req.user._id });
      await bootcamp.save();
      // console.log(bootcamp);
      req.response = {
        data: [bootcamp],
        statusCode: 201,
      };
      // console.log(req.response);
      return next();
    }
    return next(new Error("this publisher already has a bootcamp"));
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

// router  "/api/v1/bootcamps/"
// method  GET all bootcapms
// access  Private
const updateBootcamp = async (req, res, next) => {
  const { body } = req;
  const { id } = req.params;
  const {
    user: { _id },
  } = req;
  try {
    const bootcamp = await BootcampModel.findById(id);
    let isOwner = bootcamp && bootcamp.user.toString() == _id.toString();
    console.log(isOwner) ; 
    if (isOwner) {
      const bootcamp = await BootcampModel.findByIdAndUpdate(id, body, {
        new: true,
      })
        .populate("courses")
        .populate("user");
      req.response = {
        data: bootcamp ? [bootcamp] : [],
        statusCode: bootcamp ? 203 : 404,
      };
    } else {
      req.response = {
        statusCode: !bootcamp ? 404 : 401,
      };
    }
    return next();
  } catch (error) {
    next(error);
  }
};
// router  "/api/v1/bootcamps/"
// method  GET all bootcapms
// access  Private
const deleteBootcamp = async (req, res, next) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req;

  try {
    const bootcamp = await BootcampModel.findById(id);
    let isOwner = bootcamp && bootcamp.user.toString() == _id.toString();
    if (isOwner) {
      await CourseModel.deleteMany({ bootcamp: id });
      await bootcamp.remove();
      req.response = {
        data: bootcamp ? [bootcamp] : [],
        statusCode: bootcamp ? 202 : 404,
      };
    } else {
      req.response = {
        statusCode: !bootcamp ? 404 : 401,
      };
    }
    return next();
  } catch (error) {
    next(error);
  }
};

// router  "/api/v1/bootcamps/:zipcode/:distance"
// method  GET all bootcapms by radius
// access  Private
const getBootcampsByRadius = async (req, res, next) => {
  const { zipcode, distance } = req.params;
  const radius = distance / 3963; // radius in miles
  try {
    const location = await geocoder.geocode(zipcode);
    const latitude = location[0].latitude;
    const longitude = location[0].longitude;
    const bootcamps = await BootcampModel.find({
      location: {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], radius],
        },
      },
    }).populate("user");
    req.response = {
      data: bootcamps ? bootcamps : [],
      statusCode: bootcamps ? 200 : 404,
    };
    next();
  } catch (error) {
    next(error);
  }
};

const getBootcampCourses = async (req, res, next) => {
  console.log(req.params.id, "from  course controller");
  const { id } = req.params;
  try {
    const courses = await CourseModel.find({ bootcamp: id });
    req.response = {
      statusCode: courses.length > 0 ? 200 : 404,
      data: courses.length > 0 ? courses : [],
    };
    next();
  } catch (err) {
    next(err);
  }
};
const uploadBootcampImage = async function (req, res, next) {
  try {
    const { id } = req.params;
    const { image } = req.files;
    let isUploaded = req.files ? true : false;
    // checking the type of the uploaded file
    if (
      isUploaded &&
      image.mimetype.split("/")[0] === "image" &&
      image.size < process.env.MAX_FILE_UPLOAD
    ) {
      console.log(image.name, " from the conditional statement");
      image.name = `photo-${id}${path.parse(image.name).ext}`;
      console.log(image.name);
      image.mv(`${process.env.FILE_UPLOAD_PATH}/${image.name}`, async (err) => {
        if (err) next(err);
        const bootcamp = await BootcampModel.findByIdAndUpdate(
          id,
          {
            photo: image.name,
          },
          { new: true }
        ).populate("user");
        // console.log(bootcamp);
        req.response = {
          statusCode: bootcamp ? 203 : 404,
          data: bootcamp ? [bootcamp] : [],
        };
        console.log(req.response);
        next();
      });
    } else {
      console.log(image.name, " from the else statement");
      console.log(image.mimetype.split("/")[0] == "image");
      req.response = {
        statusCode: 404,
      };
      next();
    }
  } catch (err) {
    next(err);
  }
};
module.exports = {
  createBootcamp,
  deleteBootcamp,
  getBootcamp,
  getBootcamps,
  updateBootcamp,
  getBootcampsByRadius,
  getBootcampCourses,
  uploadBootcampImage,
};
// 60523fcff45b263b18483355 '/n' 60523fcff45b263b18483355
