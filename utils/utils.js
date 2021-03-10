require("dotenv").config({ path: "../config/config.env" });
const response = {
  message: "",
  errors: [],
  data: [],
  status: "Bad Request",
  statusCode: 400,
  count : 0 
};

const logger = (req, res, next) => {
  console.log(`${req.protocol}://${req.get("host")}${req.originalUrl}`);
  next();
};

module.exports = {
  response,
  logger,
};
