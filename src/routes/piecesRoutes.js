const express = require("express");
const pieceController = require("../controller/pieceController");

const router = express.Router();

router.post("/", pieceController.createPieces);
router.get("/", pieceController.getAllPieces);
router.get("/:id", pieceController.getPiecesById);
router.put("/:id", pieceController.updatePieces);
router.delete("/:id", pieceController.deletePieces);

module.exports = router;
