const express = require("express");
const router = express.Router();

// import the register controller
const {getAllInstructor} = require("../Controller/instructor.js");


// Routes for controllers
router.get("/get-all",getAllInstructor);

module.exports = router;