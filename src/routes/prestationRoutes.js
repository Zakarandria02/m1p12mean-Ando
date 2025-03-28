const express = require("express");
const prestationController = require("../controller/prestationController");

const router = express.Router();

router.post("/", prestationController.createPrestation);
router.get("/", prestationController.getAllPrestation);
router.get("/:id", prestationController.getPrestationById);
router.put("/:id", prestationController.updatePrestation);
router.delete("/:id", prestationController.deletePrestation);

module.exports = router;
