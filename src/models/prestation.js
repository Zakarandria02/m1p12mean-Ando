const mongoose = require("mongoose");

const prestationSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  prix: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Prestation = mongoose.model("Prestation", prestationSchema);
module.exports = Prestation;
