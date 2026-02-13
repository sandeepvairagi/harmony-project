const express = require("express");
const router = express.Router();

// import the register controller
const {updateUser, updateInstructor} = require("../Controller/auth.js");


// Routes for controllers
router.put("/update-user",updateUser);
router.put("/update-instructor", updateInstructor);

module.exports = router;