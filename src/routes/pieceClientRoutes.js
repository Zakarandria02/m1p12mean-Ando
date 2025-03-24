const express = require("express");
const pieceClientController = require("../controller/pieceClientController");

const router = express.Router();

router.post("/", pieceClientController.createPieceClient);
router.get("/", pieceClientController.getAllPieceClient);
router.get("/:id", pieceClientController.getPieceClientById);
router.put("/:id", pieceClientController.updatePieceClient);
router.delete("/:id", pieceClientController.deletePieceClient);

module.exports = router;
