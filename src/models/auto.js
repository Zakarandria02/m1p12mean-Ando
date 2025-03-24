const mongoose = require("mongoose");
const User = require("./user");

const AutoSchema = new mongoose.Schema({
  marque: { type: String },
  modele: { type: String },
  annee: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Référence à un utilisateur "Client"
});

// Hook pour associer automatiquement un utilisateur ayant le profil "Client"
/*AutoSchema.pre("save", async function (next) {
  if (!this.user) {
    const clientUser = await User.findOne({ profile: "Client" });
    if (clientUser) {
      this.user = clientUser._id;
    } else {
      return next(
        new Error("Aucun utilisateur avec le profil 'Client' trouvé")
      );
    }
  }
  next();
});*/

module.exports = mongoose.model("Auto", AutoSchema);
