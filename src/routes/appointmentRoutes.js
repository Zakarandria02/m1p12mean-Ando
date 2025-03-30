const express = require("express");
const appointmentController = require("../controller/appointmentController");

const router = express.Router();

router.post("/", appointmentController.createAppointment);
/*router.get("/", appointmentController.getAllPieces);
router.get("/:id", appointmentController.getPiecesById);
router.put("/:id", appointmentController.updatePieces);
router.delete("/:id", appointmentController.deletePieces);*/

module.exports = router;

/*const express = require("express");
const appointmentController = require("../controller/appointmentController");
const verifyTokens = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/create",
  verifyTokens.verifyToken,
  appointmentController.createAppointment
);

module.exports = router;*/
