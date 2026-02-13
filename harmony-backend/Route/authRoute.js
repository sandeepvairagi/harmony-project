const express = require("express");
const router = express.Router();

// import the register controller
const {register} = require("../Controller/auth.js");
const {login} = require("../Controller/auth.js");
const {createStreak, getUser, getInstructor } = require("../Controller/auth.js");


// Routes for controllers
router.post("/register",register);
router.post("/login",login);
router.put("/create-streak",createStreak);
router.get('/get-user/:id',getUser);
router.get('/get-instructor/:id',getInstructor);

module.exports = router;