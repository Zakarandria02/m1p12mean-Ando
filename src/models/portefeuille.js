const mongoose = require("mongoose");
const User = require("./user");

const PortefeuilleSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  money: { type: Number, required: true },
});

module.exports = mongoose.model("Portefeuille", PortefeuilleSchema);
