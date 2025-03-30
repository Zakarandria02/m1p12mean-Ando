const express = require("express");
const appointmentController = require("../controller/appointmentController");
const verifyTokens = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/create",
  verifyTokens.verifyToken,
  appointmentController.createAppointment
);

module.exports = router;
