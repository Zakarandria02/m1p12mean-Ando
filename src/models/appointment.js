const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
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
  prestation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Prestation",
    required: true,
  },
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
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;
