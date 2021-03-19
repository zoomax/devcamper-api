const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const bootcamps = require("./routes/bootcamp");
const courses = require("./routes/course");
const files = require("./routes/file");
const auth = require("./routes/auth");
const cors = require("cors");
const connectDB = require("./db/dbConnection");
const morgan = require("morgan");
const colors = require("colors");
const cookieParser = require("cookie-parser") ; 
const fileUpload = require("express-fileupload");
const users  = require("./routes/user") ; 

const centralErrorHandler = require("./utils/errorHandler");
const PORT = process.env.PORT || 5000;
dotenv.config({ path: "./config/config.env" });
const app = express();
// using Cookies in your api 
app.use(cookieParser()); 
// in order to interact with cookies, you need to activate interceptors within postman 
// which is located at the very top of the application in the form of a button with satallite-icon 
// all you need is to click it and turn it on. that's all folks 
connectDB();
if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}
app.use(express.static(path.join(__dirname, process.env.FILE_UPLOAD_PATH)));
app.use(cors());
app.use(express.json({ limit: "50mb", extended: true }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(fileUpload());
app.post("/", async (req, res) => {
  console.log(req.files);
  res.json({ message: req.files ? "file uploaded" : "no file uploaded" });
});
app.use("/api/v1/auth", auth);
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/files/", files);
app.use("/api/v1/users/", users);

app.use(centralErrorHandler);
const server = app.listen(PORT, () => {
  console.log(
    `server is running  on port ${PORT} within the ${process.env.NODE_ENV} mode`
      .yellow.bold
  );
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`${err.message}.red`);
  server.close(() => process.exit(1));
});
