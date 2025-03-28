const mongoose = require("mongoose");
// const User = require("./user");

const prestationSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    unique: true,
  },
  prix: {
    type: Number,
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Prestation = mongoose.model("Prestation", prestationSchema);

module.exports = Prestation;
