const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { sendActivationEmail } = require("../utils/emailService");

// Inscription
exports.register = async (req, res) => {
  try {
    const { nom, prenom, password, email, phone, profile } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: "Cet email est déjà utilisé." });
    }

    // Créer un nouvel utilisateur
    const user = new User({
      nom,
      prenom,
      password,
      email,
      phone,
      /*profile,
      isAdmin: profile === "Manager", // Manager est admin
      isActivated: profile !== "Mécanicien",*/ // Désactiver le compte Mécanicien par défaut
    });

    // Générer un token d'activation pour les Mécaniciens
    if (profile === "Client") {
      user.activationToken = jwt.sign(
        { email },
        process.env.JWT_SECRET || "votre_clé_secrète",
        { expiresIn: "1h" }
      );

      // Trouver l'ADMIN Manager pour lui envoyer un email
      const adminManager = await User.findOne({
        profile: "Manager",
      });
      if (adminManager) {
        await sendActivationEmail(adminManager.email, user.activationToken); // Envoyer l'email d'activation
      }
    }

    await user.save();
    res.status(201).send({ message: "Utilisateur créé avec succès.", user });
  } catch (error) {
    res.status(500).send({ message: "Erreur lors de l'inscription.", error });
  }
};

// Connexion
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Trouver l'utilisateur par email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "Utilisateur non trouvé." });
    }

    // Vérifier si le compte est activé (sauf pour les Mécaniciens)
    if (user.profile === "Mécanicien" && !user.isActivated) {
      return res.status(403).send({
        message: "Votre compte doit être activé par un administrateur.",
      });
    }

    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).send({ message: "Mot de passe incorrect." });
    }

    // Générer un token JWT
    const token = jwt.sign(
      { userId: user._id, profile: user.profile, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || "votre_clé_secrète",
      { expiresIn: "1h" }
    );

    res.status(200).send({ message: "Connexion réussie.", token, user });
  } catch (error) {
    res.status(500).send({ message: "Erreur lors de la connexion.", error });
  }
};
