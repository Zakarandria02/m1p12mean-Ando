const express = require("express");
const portefeuilleController = require("../controller/portefeuilleController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", portefeuilleController.createPortefeuille);
router.get("/", portefeuilleController.getAllPortefeuille);
router.get("/:id", portefeuilleController.getPortefeuilleById);
router.put("/:id", portefeuilleController.updatePortefeuille);
router.delete("/:id", portefeuilleController.deletePortefeuille);
router.get("/:id/user", portefeuilleController.getPortefeuilleByUserId);

module.exports = router;
