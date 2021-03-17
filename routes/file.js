const express = require("express");
const router = express.Router();
const { uploadBootcampImage} = require("../controllers/bootcamp") ; 
const responseHandler = require("../utils/responseHandler");
router.route("/bootcamps/:id/image").post(uploadBootcampImage , responseHandler);

module.exports = router;
