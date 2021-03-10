const nodeGeoCoder = require("node-geocoder");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
console.log(process.env.MONGO_URI ," from geocoder ");
const options = {
  httpAdapter: "https",
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null,
  provider: process.env.GEOCODER_PROVIDER,
};

const geocoder = nodeGeoCoder(options);
module.exports = geocoder;
