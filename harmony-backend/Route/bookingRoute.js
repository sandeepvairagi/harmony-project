const express = require("express");
const { getCheckoutSession } = require('../Controller/bookingController');

const router = express.Router();

router.post('/checkout-session/:instructorId', getCheckoutSession);

module.exports = router;