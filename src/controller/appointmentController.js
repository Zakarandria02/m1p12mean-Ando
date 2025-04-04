const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Assurez-vous que ces chemins sont corrects
const Auto = require("../models/auto");
const Prestation = require("../models/prestation");
const Appointment = require("../models/appointment");
const Wallet = require("../models/portefeuille");

exports.updateAppointmentStatusPaiement = async (req, res) => {
  try {
    const { user, appointmentId, paiement } = req.body;
    console.log("Requête reçue :", req.body);

    if (!user || !appointmentId || !paiement) {
      return res
        .status(400)
        .json({ message: "Informations requises manquantes." });
    }

    const client = await User.findById(user);
    if (!client || client.role !== "client") {
      return res.status(403).json({
        message:
          "Accès refusé. Seuls les clients peuvent modifier le paiement.",
      });
    }

    const appointment = await Appointment.findById(appointmentId)
      .populate("prestations") // On charge toutes les prestations du rendez-vous
      .populate("piece") // Charge toutes les pièces du rendez-vous
      .populate("user");
    if (!appointment) {
      return res.status(404).json({ message: "Rendez-vous non trouvé." });
    }

    if (!appointment.user.equals(client._id)) {
      return res.status(403).json({
        message: "Vous ne pouvez modifier que vos propres rendez-vous.",
      });
    }

    // if (paiement === "Payé" && appointment.paiement !== "Payé") {
    //   // Calcul du prix total des prestations
    //   const totalPrix = appointment.prestations.reduce((total, prestation) => {
    //     const prix = Number(prestation.prix);
    //     if (isNaN(prix) || prix <= 0) {
    //       throw new Error("Prix de la prestation invalide.");
    //     }
    //     return total + prix;
    //   }, 0);

    //   const wallet = await Wallet.findOne({ user: client._id });
    //   if (!wallet) {
    //     return res.status(404).json({ error: "Portefeuille non trouvé." });
    //   }

    //   if (wallet.money < totalPrix) {
    //     return res
    //       .status(400)
    //       .json({ error: "Fonds insuffisants dans le portefeuille." });
    //   }

    //   // Soustraction du montant du portefeuille
    //   wallet.money -= totalPrix;
    //   await wallet.save();
    // }
    if (paiement === "Payé" && appointment.paiement !== "Payé") {
      // 🔹 Calcul du prix total des prestations
      const totalPrixPrestations = appointment.prestations.reduce(
        (total, prestation) => {
          const prix = Number(prestation.prix);
          if (isNaN(prix) || prix <= 0) {
            throw new Error("Prix de la prestation invalide.");
          }
          return total + prix;
        },
        0
      );

      // 🔹 Calcul du prix total des pièces
      const totalPrixPieces = appointment.piece.reduce((total, piece) => {
        const prix = Number(piece.prix);
        if (isNaN(prix) || prix <= 0) {
          throw new Error("Prix de la pièce invalide.");
        }
        return total + prix;
      }, 0);

      // 🔹 Prix total à payer (Prestations + Pièces)
      const totalPrix = totalPrixPrestations + totalPrixPieces;

      const wallet = await Wallet.findOne({ user: client._id });
      if (!wallet) {
        return res.status(404).json({ error: "Portefeuille non trouvé." });
      }

      if (wallet.money < totalPrix) {
        return res
          .status(400)
          .json({ error: "Fonds insuffisants dans le portefeuille." });
      }

      // 💰 Soustraction du montant du portefeuille
      wallet.money -= totalPrix;
      await wallet.save();
    }

    // Mettre à jour le statut du paiement
    // appointment.paiement = paiement;
    // await appointment.save();
    appointment.paiement = paiement;
    appointment.$ignore("date"); // Ignore la validation de la date
    await appointment.save();

    res.json({
      success: true,
      message: "Paiement du rendez-vous mis à jour.",
      appointment,
    });
  } catch (error) {
    console.error("[ERROR]", error);
    res.status(500).json({ message: "Une erreur interne est survenue." });
  }
};

exports.createAppointment = async (req, res) => {
  try {
    const {
      nom,
      email,
      phone,
      auto: autoInput,
      prestations,
      date,
      password,
    } = req.body;

    if (
      !email ||
      !autoInput ||
      !prestations ||
      prestations.length === 0 ||
      !date
    ) {
      return res.status(400).json({
        message:
          "Veuillez fournir toutes les informations requises, y compris au moins une prestation.",
      });
    }

    let user = await User.findOne({ email });
    console.log(user);
    let token;

    if (!user) {
      user = new User({ nom, email, phone, password });
      await user.save();
      token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
    } else if (user.password) {
      if (!password) {
        return res.status(400).json({ message: "Mot de passe requis." });
      }
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

    // Extraction des détails de l'auto
    const autoParts = autoInput.split(" ");
    const annee = parseInt(autoParts.pop(), 10);
    const marque = autoParts.shift();
    const modele = autoParts.join(" ");

    let auto = await Auto.findOne({ user: user._id, marque, modele, annee });
    if (!auto) {
      auto = new Auto({ user: user._id, marque, modele, annee });
      await auto.save();
    }

    // Vérification de l'existence des prestations demandées
    const prestationsExistantes = await Prestation.find({
      _id: { $in: prestations },
    });
    if (prestationsExistantes.length !== prestations.length) {
      return res.status(404).json({
        message: "Une ou plusieurs prestations sélectionnées n'existent pas.",
      });
    }

    // Vérification si l'utilisateur a déjà un rendez-vous avec l'une de ces prestations sur le même véhicule
    const existingAppointment = await Appointment.findOne({
      user: user._id,
      auto: auto._id,
      prestations: { $in: prestations },
    });

    if (existingAppointment) {
      return res.status(400).json({
        message:
          "Un rendez-vous avec au moins une de ces prestations existe déjà pour cette voiture.",
      });
    }

    // Création du rendez-vous avec plusieurs prestations
    const appointment = new Appointment({
      user: user._id,
      auto: auto._id,
      prestations: prestations, // Stocke plusieurs prestations
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
      .populate("prestations")
      .populate("piece");
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

exports.getTachePiece = async (req, res) => {
  try {
    const { piece } = req.body;
    // Récupération des données de la requête
    const reservationId = req.params.id;

    // Vérifier si la réservation existe
    const existingReservation = await Appointment.findById(reservationId);
    if (!existingReservation) {
      return res.status(404).json({ message: "Réservation non trouvée" });
    }

    // Mise à jour de la réservation avec le mécanicien et les pièces (si fournies)
    const updateData = { piece };
    if (piece && Array.isArray(piece) && piece.length > 0) {
      updateData.piece = piece;
    }

    const updatedReservation = await Appointment.findByIdAndUpdate(
      reservationId,
      updateData,
      { new: true }
    );

    res.json(updatedReservation);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

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
    .populate("prestations") // Récupère les infos de la prestation
    .populate("piece");

  res.json(reservations);
};

exports.getReservationbyClient = async (req, res) => {
  const user = req.params.id;
  const reservations = await Appointment.find({ user })
    .populate("mecanicienId")
    .populate("user") // Récupère les infos du mécanicien
    .populate("auto") // Récupère les infos de la voiture
    .populate("prestations") // Récupère les infos de la prestation
    .populate("piece");
  res.json(reservations);
};
