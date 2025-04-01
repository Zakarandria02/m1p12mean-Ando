const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Assurez-vous que ces chemins sont corrects
const Auto = require("../models/auto");
const Prestation = require("../models/prestation");
const Appointment = require("../models/appointment");
const Wallet = require("../models/portefeuille");

exports.createAppointment = async (req, res) => {
  try {
    const {
      nom,
      email,
      phone,
      auto: autoInput,
      prestationId,
      date,
      password,
    } = req.body;

    // Vérification des champs requis
    if (!email || !autoInput || !prestationId || !date) {
      return res.status(400).json({
        message: "Veuillez fournir toutes les informations requises.",
      });
    }

    let user = await User.findOne({ email });
    let token;

    if (!user) {
      console.log("[DEBUG] Création d'un nouvel utilisateur:", email);

      user = new User({
        nom,
        email,
        phone,
        password,
      });

      await user.save();

      token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
    } else if (user.password) {
      console.log("[DEBUG] Utilisateur trouvé:", user.email);
      console.log("[DEBUG] Password fourni:", password);
      console.log("[DEBUG] Password stocké:", user.password);

      if (!password) {
        console.log("[DEBUG] Aucun mot de passe fourni dans la requête.");
        return res.status(400).json({ message: "Mot de passe requis." });
      }

      console.log("[DEBUG] Comparaison des mots de passe en cours...");
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).send({ message: "Mot de passe incorrect." });
      }

      token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
    } else {
      return res.status(400).json({
        message: "Aucun mot de passe enregistré pour cet utilisateur.",
      });
    }
    const autoParts = autoInput.split(" ");
    const annee = parseInt(autoParts.pop(), 10);
    const marque = autoParts.shift();
    const modele = autoParts.join(" ");

    let auto = await Auto.findOne({ user: user._id, marque, modele, annee });
    if (!auto) {
      auto = new Auto({ user: user._id, marque, modele, annee });
      await auto.save();
    }

    const prestation = await Prestation.findById(prestationId);
    if (!prestation) {
      return res
        .status(404)
        .json({ message: "La prestation sélectionnée n'existe pas." });
    }

    // Vérifier si la prestation a déjà été effectuée par le même utilisateur sur la même voiture
    const existingAppointment = await Appointment.findOne({
      user: user._id,
      auto: auto._id,
      prestation: prestationId,
    });

    if (existingAppointment) {
      return res.status(400).json({
        message:
          "Vous avez déjà fait cette même prestation sur cette même voiture.",
      });
    }
    const appointment = new Appointment({
      user: user._id,
      auto: auto._id,
      prestation: prestation._id,
      date: new Date(date),
    });
    await appointment.save();

    res.json({
      success: true,
      appointment,
      token: token || null,
      userExists: !!user,
    });
  } catch (error) {
    console.error("[ERROR]", error);
    res.status(500).json({ message: "Une erreur interne est survenue." });
  }
};

exports.getAllReservation = async (req, res) => {
  try {
    const reservations = await Appointment.find()
      .populate("user")
      .populate("mecanicienId")
      .populate("auto")
      .populate("prestation");
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.getAllMecano = async (req, res) => {
  try {
    const mecaniciens = await User.find({ role: "mechanic" }).select(
      "nom email"
    ); // Récupère uniquement le nom & email
    res.json(mecaniciens);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Route pour assigner un mécanicien à une réservation
exports.getTacheMecano = async (req, res) => {
  try {
    const { mecanicienId } = req.body;
    const reservationId = req.params.id;

    // Mise à jour de la réservation avec le mécanicien assigné
    const updatedReservation = await Appointment.findByIdAndUpdate(
      reservationId,
      { mecanicienId },
      { new: true }
    );

    if (!updatedReservation) {
      return res.status(404).json({ message: "Réservation non trouvée" });
    }

    res.json(updatedReservation);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.getTachebyIdmecano = async (req, res) => {
  const mecanicienId = req.params.id;
  const reservations = await Appointment.find({ mecanicienId })
    .populate("user") // Récupère les infos du client
    .populate("auto") // Récupère les infos de la voiture
    .populate("prestation"); // Récupère les infos de la prestation

  res.json(reservations);
};

exports.getReservationbyClient = async (req, res) => {
  const user = req.params.id;
  const reservations = await Appointment.find({ user })
    .populate("mecanicienId") // Récupère les infos du mécanicien
    .populate("auto") // Récupère les infos de la voiture
    .populate("prestation"); // Récupère les infos de la prestation
  res.json(reservations);
};
