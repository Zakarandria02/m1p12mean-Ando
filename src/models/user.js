const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String },
  password: { type: String },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  role: {
    type: String,
    enum: ["client", "mechanic", "admin"],
    default: "client",
  },
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
