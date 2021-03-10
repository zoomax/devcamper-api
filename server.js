const express = require("express");
const dotenv = require("dotenv");
const bootcamps = require("./routes/bootcamp");
const courses = require("./routes/course");
const cors = require("cors");
const connectDB = require("./db/dbConnection");
const morgan = require("morgan");
const colors  = require("colors") ; 
const centralErrorHandler = require("./utils/errorHandler");
const PORT = process.env.PORT || 5000;
dotenv.config({ path: "./config/config.env" });
const app = express();
connectDB();
if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}
app.use(cors());
app.use(express.json());
app.use(express.json({ extended: false }));
// app.use(logger)
app.get("/", (req, res) => {
  res.json({ message: "api running" });
});
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use(centralErrorHandler) ; 
const server = app.listen(PORT, () => {
  console.log(
    `server is running  on port ${PORT} within the ${process.env.NODE_ENV} mode`.yellow.bold
  );
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`${err.message}.red`);
  server.close(() => process.exit(1));
});
