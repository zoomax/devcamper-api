const mongoose = require("mongoose");
const colors = require("colors");
const fs = require("fs");
const BootcampModel = require("./db/models/bootcamp");
const CourseModel  = require("./db/models/course") ; 
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

mongoose.connect(process.env.MONGO_URI, {
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  autoIndex: true,
  useNewUrlParser: true,
});

const importData = async function () {
  try {
    const bootcamps = JSON.parse(
      fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
    );
    const courses = JSON.parse(
      fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
    );
    await BootcampModel.create(bootcamps);
    await CourseModel.create(courses) ; 
    console.log("Data imported...".green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

const destroyData = async function () {
  try {
    await BootcampModel.deleteMany();
    await CourseModel.deleteMany();
    console.log("Data destroyed...".red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === "-i") {
  importData();
}
if (process.argv[2] === "-d") {
  destroyData();
}
