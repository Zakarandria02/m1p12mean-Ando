const mongoose = require("mongoose");

const AutoSchema = new mongoose.Schema({
  marque: { type: String },
  modele: { type: String },
  annee: { type: String, required: true },
});

module.exports = mongoose.model("Auto", AutoSchema);
