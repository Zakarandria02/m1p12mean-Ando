const mongoose = require("mongoose");

// Supposons que vous ayez déjà défini votre modèle User ailleurs
const User = require("./user");

const TacheSchema = new mongoose.Schema({
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    validate: {
      validator: async function (userId) {
        const user = await User.findById(userId);
        return user && user.role === "mechanic";
      },
      message: "L'utilisateur assigné doit avoir le rôle de mécanicien.",
    },
  },
  statut: {
    type: String,
    enum: ["En Attente", "En Cours", "Terminé"],
    default: "En Attente",
  },
});

module.exports = mongoose.model("TacheMecano", TacheSchema);
