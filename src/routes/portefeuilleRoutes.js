const express = require("express");
const portefeuilleController = require("../controller/portefeuilleController");

const router = express.Router();

router.post("/", portefeuilleController.createPortefeuille);
router.get("/", portefeuilleController.getAllPortefeuille);
router.get("/:id", portefeuilleController.getPortefeuilleById);
router.put("/:id", portefeuilleController.updatePortefeuille);
router.delete("/:id", portefeuilleController.deletePortefeuille);

module.exports = router;
