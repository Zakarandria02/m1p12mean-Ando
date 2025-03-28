const mongoose = require("mongoose");
const User = require("./user");

const AutoSchema = new mongoose.Schema({
  marque: { type: String },
  modele: { type: String },
  annee: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Référence à un utilisateur "Client"
});

module.exports = mongoose.model("Auto", AutoSchema);
