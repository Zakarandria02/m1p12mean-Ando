const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  nom: { type: String },
  prenom: { type: String },
  password: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  profile: {
    type: String,
    enum: ["Client", "Mécanicien", "Manager"],
    required: true,
  },
  isAdmin: { type: Boolean, default: false },
  isActivated: { type: Boolean, default: false }, // Compte désactivé par défaut
  activationToken: { type: String }, // Token pour l'activation par email
});

// Hacher le mot de passe avant de sauvegarder l'utilisateur
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Méthode pour comparer les mots de passe
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
