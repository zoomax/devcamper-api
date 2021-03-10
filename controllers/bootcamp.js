const BootcampModel = require("../db/models/bootcamp");
const { remove } = require("../db/models/course");
const CourseModel = require("../db/models/course");
const geocoder = require("../utils/geocoder");
// router  "/api/v1/bootcamps/"
// method  GET all bootcapms
// access  Public
const getBootcamps = async function (req, res, next) {
  let queryCopy = { ...req.query };
  let { select, sort, limit, page } = req.query;
  let selectionString = select ? select.split(",").join(" ") : "";
  let sortString = sort ? sort.split(",").join(" ") : "";
  let fields = ["sort", "select", "limit", "page"];
  let currentPage = page ? parseInt(page, 10) : 1;
  let currentPageLimit = limit ? parseInt(limit, 10) : 25;
  let skippedItems = (currentPage - 1) * currentPageLimit;
  fields.forEach((param) => delete queryCopy[param]);
  let stringifiedQuery = JSON.stringify(queryCopy);
  let query = stringifiedQuery.replace(
    /\b(in|gte|gt|lt|lte)\b/g,
    (match) => `$${match}`
  );
  try {
    const total = await BootcampModel.countDocuments();
    const bootcamps = await BootcampModel.find(JSON.parse(query))
      .select(selectionString)
      .sort(sortString)
      .skip(skippedItems)
      .limit(currentPageLimit).populate("courses","name description");

    req.response = {
      statusCode: 200,
      data: bootcamps.length ? bootcamps : [],
      pagination: {
        next:
          skippedItems < total
            ? {
                page: currentPage + 1,
                limit: currentPageLimit,
              }
            : undefined,
        prev:
          skippedItems > 0
            ? {
                page: currentPage - 1,
                limit: currentPageLimit,
              }
            : undefined,
      },
    };

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
    const bootcamp = await BootcampModel.findById(id).populate("courses","title description tuition");
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
    const bootcamp = new BootcampModel({ ...body });
    await bootcamp.save();
    // console.log(bootcamp);
    req.response = {
      data: [bootcamp],
      statusCode: 201,
    };
    // console.log(req.response);
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// router  "/api/v1/bootcamps/"
// method  GET all bootcapms
// access  Private
const updateBootcamp = async (req, res, next) => {
  const { body } = req;
  const { id } = req.params;
  try {
    const bootcamp = await BootcampModel.findByIdAndUpdate(id, body, {
      new: true,
    }).populate("courses");
    req.response = {
      data: bootcamp ? [bootcamp] : [],
      statusCode: bootcamp ? 203 : 404,
    };
    next();
  } catch (error) {
    next(error);
  }
};
// router  "/api/v1/bootcamps/"
// method  GET all bootcapms
// access  Private
const deleteBootcamp = async (req, res, next) => {
  const { id } = req.params;

  try {
    const bootcamp = await BootcampModel.findById(id);
    if (bootcamp) {
      await CourseModel.deleteMany({ bootcamp: id });
      await bootcamp.remove();
    }
    req.response = {
      data: bootcamp ? [bootcamp] : [],
      statusCode: bootcamp ? 202 : 404,
    };
    next();
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
    });
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

module.exports = {
  createBootcamp,
  deleteBootcamp,
  getBootcamp,
  getBootcamps,
  updateBootcamp,
  getBootcampsByRadius,
  getBootcampCourses,
};
