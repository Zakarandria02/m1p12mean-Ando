const mongoose = require("mongoose");

const PieceSchema = new mongoose.Schema({
  codearticle: { type: String },
  marque: { type: String },
  reference: { type: String },
  lib: { type: String },
  prix: { type: Number, required: true },
  Qte: { type: Number, required: true },
});

module.exports = mongoose.model("Piece", PieceSchema);
