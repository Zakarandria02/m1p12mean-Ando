const express = require("express");
const appointmentController = require("../controller/appointmentController");
const tacheMecanoController = require("../controller/tacheMecanoController");

const router = express.Router();

router.post("/", appointmentController.createAppointment);
router.get("/admin", appointmentController.getAllReservation);
router.get("/mecaniciens", appointmentController.getAllMecano);
router.put("/:id/assign", appointmentController.getTacheMecano);
router.put("/:id/piece", appointmentController.getTachePiece);
router.put(
  "/:id/paiement",
  appointmentController.updateAppointmentStatusPaiement
);
router.get("/:id/taches", appointmentController.getTachebyIdmecano);
router.get("/:id/client", appointmentController.getReservationbyClient);
router.put("/:id/status", tacheMecanoController.updateStatut);

// router.delete("/:id", appointmentController.deletePieces);getTachebyIdmecano

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
