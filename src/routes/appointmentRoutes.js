const express = require("express");
const appointmentController = require("../controller/appointmentController");

const router = express.Router();

router.post("/", appointmentController.createAppointment);

module.exports = router;
