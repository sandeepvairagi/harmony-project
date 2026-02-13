const express = require("express");
const router = express.Router();

// import the register controller
const {createStreak} = require("../Controller/streakController.js");

// Routes for controllers
router.post("/create",createStreak);

module.exports = router;