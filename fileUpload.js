const express = require("express");
const fileupload = require("express-fileupload");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
const port = process.env.PORT || 4000;

const app = express();
app.use(fileupload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/", (req, res, next) => {
  console.log(req.files);
  if (!req.files) {
    res.json({
      message: "files were not uploaded ",
    });
  } else {
    res.json({
      message: "files were uploaded successfully",
    });
  }
});

app.listen(port, () => {
  console.log(`app is running on port  ${port}`);
});
