const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Auto = require("../models/auto");
const Prestation = require("../models/prestation");
const Appointment = require("../models/appointment");

exports.createAppointment = async (req, res) => {
  try {
    const {
      nom,
      email,
      phone,
      auto: autoInput,
      prestation: prestationData,
      date,
      password,
    } = req.body;

    // Vérification des champs requis
    if (!email || !autoInput || !prestationData || !date) {
      return res.status(400).json({
        message: "Veuillez fournir toutes les informations requises.",
      });
    }

    let user = await User.findOne({ email });
    let token;

    if (!user) {
      // Hachage du mot de passe si fourni
      const hashedPassword = password
        ? await bcrypt.hash(password, 10)
        : undefined;
      user = new User({
        nom,
        email,
        phone,
        ...(hashedPassword && { password: hashedPassword }),
      });
      await user.save();
      token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
    } else if (user.password) {
      // Vérification du mot de passe si l'utilisateur a un mot de passe enregistré
      if (!password) {
        return res.status(400).json({ message: "Mot de passe requis." });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Mot de passe incorrect." });
      }
      token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
    } else {
      // Si l'utilisateur existe mais n'a pas de mot de passe enregistré
      return res.status(400).json({
        message: "Aucun mot de passe enregistré pour cet utilisateur.",
      });
    }

    // Extraction des informations du véhicule
    const autoParts = autoInput.split(" ");
    const annee = parseInt(autoParts.pop(), 10);
    const marque = autoParts.shift();
    const modele = autoParts.join(" ");

    // Vérification de l'existence du véhicule
    let auto = await Auto.findOne({ user: user._id, marque, modele, annee });
    if (!auto) {
      auto = new Auto({ user: user._id, marque, modele, annee });
      await auto.save();
    }

    // Vérification de l'existence de la prestation
    let prestation = await Prestation.findOne({
      user: user._id,
      ...prestationData,
    });
    if (!prestation) {
      prestation = new Prestation({ user: user._id, ...prestationData });
      await prestation.save();
    }

    // Création du rendez-vous
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
    res.status(500).json({ message: error.message });
  }
};
