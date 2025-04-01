const express = require("express");
const tacheMecanoController = require("../controller/tacheMecanoController");

const router = express.Router();

router.post("/", tacheMecanoController.createTacheMecano);
router.get("/", tacheMecanoController.getAllTacheMecano);
router.get("/facture/:id", tacheMecanoController.getFactureClient);
router.get("/facture", tacheMecanoController.getFacture);
router.get("/details", tacheMecanoController.getAllDetails);
router.get("/details/:id", tacheMecanoController.getTacheMecanoById);
router.get("/:id", tacheMecanoController.getTacheMecanoById);
//router.put("/:id", tacheMecanoController.updateTacheMecano);
router.put("/:id", tacheMecanoController.updateStatut);
//router.put("/:id", tacheMecanoController.updateTacheMecano);
router.delete("/:id", tacheMecanoController.deleteTacheMecano);

module.exports = router;
