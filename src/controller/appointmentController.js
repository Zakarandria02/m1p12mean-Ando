const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Assurez-vous que ces chemins sont corrects
const Auto = require("../models/auto");
const Prestation = require("../models/prestation");
const Appointment = require("../models/appointment");

/*Connecté tsy mila info Vraie*/
/*exports.createAppointment = async (req, res) => {
  try {
    console.log("Requête reçue avec userId:", req.userId);

    const { auto: autoInput, prestationId, date } = req.body;

    if (!autoInput || !prestationId || !date) {
      return res.status(400).json({
        message: "Veuillez fournir toutes les informations requises.",
      });
    }

    // Trouver l'utilisateur avec son ID
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }
    console.log("Utilisateur trouvé:", user);

    // Traiter les données de la voiture
    const autoParts = autoInput.split(" ");
    const annee = parseInt(autoParts.pop(), 10);
    const marque = autoParts.shift();
    const modele = autoParts.join(" ");

    let auto = await Auto.findOne({ user: user._id, marque, modele, annee });
    if (!auto) {
      auto = new Auto({ user: user._id, marque, modele, annee });
      await auto.save();
      console.log("Nouvelle voiture enregistrée:", auto);
    } else {
      console.log("Véhicule déjà enregistré:", auto);
    }

    // Vérifier la prestation
    const prestation = await Prestation.findById(prestationId);
    if (!prestation) {
      return res.status(404).json({ message: "Prestation introuvable." });
    }
    console.log("Prestation trouvée:", prestation);

    // Vérifier si une prestation a déjà été faite pour cette voiture
    const existingAppointment = await Appointment.findOne({
      user: user._id,
      auto: auto._id,
      prestation: prestationId,
    });

    if (existingAppointment) {
      return res.status(400).json({
        message: "Vous avez déjà effectué cette prestation sur cette voiture.",
      });
    }

    // Créer le rendez-vous
    const appointment = new Appointment({
      user: user._id,
      auto: auto._id,
      prestation: prestation._id,
      date: new Date(date),
    });

    await appointment.save();
    console.log("Rendez-vous créé:", appointment);

    res.json({
      success: true,
      appointment,
    });
  } catch (error) {
    console.error("[ERROR]", error);
    res.status(500).json({ message: "Une erreur interne est survenue." });
  }
};*/

/*exports.createAppointment = async (req, res) => {
  // <-- Ajoute async ici
  try {
    console.log("Req.userId:", req.userId); // Vérification

    const {
      auto: autoInput,
      prestationId,
      date,
      nom,
      email,
      phone,
      password,
    } = req.body;

    if (!autoInput || !prestationId || !date) {
      return res.status(400).json({
        message: "Veuillez fournir toutes les informations requises.",
      });
    }

    let user = null;
    let token = null;

    if (req.userId) {
      // 🔹 L'utilisateur est connecté, on récupère ses infos
      user = await User.findById(req.userId); // <-- ICI, "await" fonctionne car la fonction est async
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé." });
      }
    } else {
      // 🔹 Si l'utilisateur n'est PAS connecté, on attend un email et un password
      if (!email || !password) {
        console.log("Utilisateur non connecté, email et mot de passe requis.");
        return res
          .status(400)
          .json({ message: "Email et mot de passe sont requis." });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Cet email est déjà utilisé." });
      }

      user = new User({
        nom,
        email,
        phone,
        password: await bcrypt.hash(password, 10),
      });
      await user.save();

      token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
    }

    console.log("Utilisateur trouvé/créé:", user);

    // Suite du traitement...
  } catch (error) {
    console.error("[ERROR]", error);
    res.status(500).json({ message: "Une erreur interne est survenue." });
  }
};*/

/*Vrai 1er cas*/
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
    if (!autoInput || !prestationId || !date) {
      return res.status(400).json({
        message: "Veuillez fournir toutes les informations requises.",
      });
    }

    let user;
    let token;

    // Si l'utilisateur est connecté (token présent)
    if (req.userId) {
      user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé." });
      }
    } else {
      // Si l'utilisateur n'est pas connecté, création d'un nouvel utilisateur
      if (!email || !password) {
        return res.status(400).json({
          message:
            "Email et mot de passe sont requis pour un nouvel utilisateur.",
        });
      }

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
        message: "Vous avez déjà effectué cette prestation sur cette voiture.",
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

/*exports.createAppointment = async (req, res) => {
  try {
    let user;
    let token;

    // Vérification si l'utilisateur est authentifié via le token
    if (req.userId) {
      // L'utilisateur est connecté, récupérer ses informations à partir de req.userId
      user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé." });
      }
    } else {
      // L'utilisateur n'est pas connecté, donc vérifier les champs pour un nouvel utilisateur
      const {
        nom,
        email,
        phone,
        password,
        auto: autoInput,
        prestationId,
        date,
      } = req.body;

      // Vérification des champs nécessaires si l'utilisateur n'est pas connecté
      if (
        !nom ||
        !email ||
        !phone ||
        !password ||
        !autoInput ||
        !prestationId ||
        !date
      ) {
        return res
          .status(400)
          .json({
            message: "Veuillez fournir toutes les informations requises.",
          });
      }

      // Création d'un nouvel utilisateur
      user = new User({ nom, email, phone, password });
      await user.save();

      // Génération du token JWT pour l'utilisateur nouvellement créé
      token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
    }

    // Traitement de l'auto
    const autoParts = req.body.auto.split(" ");
    const annee = parseInt(autoParts.pop(), 10);
    const marque = autoParts.shift();
    const modele = autoParts.join(" ");

    // Recherche de l'auto dans la base de données
    let auto = await Auto.findOne({ user: user._id, marque, modele, annee });
    if (!auto) {
      auto = new Auto({ user: user._id, marque, modele, annee });
      await auto.save();
    }

    // Recherche de la prestation
    const prestation = await Prestation.findById(req.body.prestationId);
    if (!prestation) {
      return res
        .status(404)
        .json({ message: "La prestation sélectionnée n'existe pas." });
    }

    // Vérifier si la prestation a déjà été effectuée pour cette même voiture
    const existingAppointment = await Appointment.findOne({
      user: user._id,
      auto: auto._id,
      prestation: prestation._id,
    });

    if (existingAppointment) {
      return res.status(400).json({
        message: "Vous avez déjà effectué cette prestation pour cette voiture.",
      });
    }

    // Création du rendez-vous
    const appointment = new Appointment({
      user: user._id,
      auto: auto._id,
      prestation: prestation._id,
      date: new Date(req.body.date),
    });
    await appointment.save();

    // Réponse avec succès
    res.json({
      success: true,
      appointment,
      token: token || null, // Ajout du token si l'utilisateur est nouveau
      userExists: !!user, // Indication si l'utilisateur existait déjà
    });
  } catch (error) {
    console.error("[ERROR]", error);
    res.status(500).json({ message: "Une erreur interne est survenue." });
  }
};*/

/*const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Assurez-vous que ces chemins sont corrects
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
};*/
