const mongoose = require("mongoose");
const User = require("./user");

const PieceClientSchema = new mongoose.Schema({
  codearticle: { type: String },
  marque: { type: String },
  reference: { type: String },
  lib: { type: String },
  prix: { type: Number, required: true },
  Qte: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("PieceClient", PieceClientSchema);
