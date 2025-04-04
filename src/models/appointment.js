const mongoose = require("mongoose");
const User = require("./user");

const appointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    validate: {
      validator: async function (userId) {
        const user = await User.findById(userId);
        return user && user.role === "client";
      },
      message: "Désolé, Client Introuvable.",
    },
  },
  mecanicienId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  auto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auto",
    required: true,
  },
  prestations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prestation",
      required: true,
    },
  ],
  piece: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Piece",
      default: null,
    },
  ],
  date: {
    type: Date,
    required: true,
    validate: {
      validator: function (v) {
        return v && v > Date.now();
      },
      message: (props) => `La date ${props.value} doit être dans le futur.`,
    },
  },
  status: {
    type: String,
    enum: ["En Attente", "Attribué", "En Cours", "Terminé"],
    default: "En Attente",
  },
  paiement: {
    type: String,
    enum: ["Impayé", "Payé"],
    default: "Impayé",
  },
});

// Validation : au moins une prestation obligatoire
appointmentSchema.path("prestations").validate(function (value) {
  return value.length > 0;
}, "Au moins une prestation est requise pour un rendez-vous.");

const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;
