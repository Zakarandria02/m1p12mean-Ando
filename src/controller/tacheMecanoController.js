const TacheMecano = require("../models/tacheMecano");

const Appointment = require("../models/appointment");

const Wallet = require("../models/portefeuille");

exports.updateStatut = async (req, res) => {
  try {
    const { statut } = req.body;
    const { id } = req.params; // ID de la tâche mécano

    // Vérifier si la tâche mécano existe
    const tacheMecano = await TacheMecano.findById(id);
    if (!tacheMecano) {
      return res.status(404).json({ error: "Tâche mécano non trouvée." });
    }

    if (!tacheMecano.appointment) {
      return res
        .status(400)
        .json({ error: "Aucun rendez-vous lié à cette tâche." });
    }
    // Mettre à jour la tâche mécano
    const updatedTacheMecano = await TacheMecano.findByIdAndUpdate(
      id,
      { statut },
      { new: true, runValidators: true }
    );

    // Mettre à jour le statut de l'appointment
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      tacheMecano.appointment,
      { status: statut }, // Correction du champ `status`
      { new: true, runValidators: true }
    )
      .populate("prestation")
      .populate("user"); // Peuple `prestation` et `user`

    if (!updatedAppointment) {
      return res.status(404).json({ error: "Rendez-vous non trouvé." });
    }

    /********* CONDITION DE PAIEMENT *************/

    if (statut === "Terminé") {
      // Vérifier que la prestation est bien renseignée
      if (
        !updatedAppointment.prestation ||
        !updatedAppointment.prestation.prix
      ) {
        return res
          .status(400)
          .json({ error: "Prix de la prestation introuvable." });
      }

      const prestationPrix = Number(updatedAppointment.prestation.prix);
      const clientId = updatedAppointment.user._id; // Récupérer l'ID du client

      console.log("💰 Prix de la prestation :", prestationPrix);

      if (isNaN(prestationPrix) || prestationPrix <= 0) {
        return res
          .status(400)
          .json({ error: "Prix de la prestation invalide." });
      }

      // Récupérer le portefeuille du client
      const wallet = await Wallet.findOne({ user: clientId });

      if (!wallet) {
        return res
          .status(404)
          .json({ error: "Portefeuille du client non trouvé." });
      }

      // Vérifier si le client a assez d'argent
      if (wallet.money < prestationPrix) {
        return res.status(400).json({ error: "Fonds insuffisants." });
      }

      // Déduire le montant de la prestation du portefeuille du client
      wallet.money -= prestationPrix;

      await wallet.save(); // Sauvegarder la mise à jour du portefeuille
      console.log(" Portefeuille mis à jour :", wallet);
    }

    res.status(200).json({
      tacheMecano: updatedTacheMecano,
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error(" Erreur lors de la mise à jour :", error);
    res.status(500).json({ error: "Une erreur interne est survenue." });
  }
};

/*exports.updateStatut = async (req, res) => {
  try {
    const { statut } = req.body;
    const { id } = req.params; // ID de la tâche mécano

    // Vérifier si la tâche mécano existe
    const tacheMecano = await TacheMecano.findById(id);
    if (!tacheMecano) {
      return res.status(404).json({ error: "Tâche mécano non trouvée" });
    }

    console.log("Tâche trouvée :", tacheMecano);

    if (!tacheMecano.appointment) {
      return res
        .status(400)
        .json({ error: "Aucun appointment lié à cette tâche" });
    }

    console.log("ID de l'appointment lié :", tacheMecano.appointment);

    // Mettre à jour la tâche mécano
    const updatedTacheMecano = await TacheMecano.findByIdAndUpdate(
      id,
      { statut },
      { new: true, runValidators: true }
    );

    // Mettre à jour l'appointment avec le bon champ (status au lieu de statut)
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      tacheMecano.appointment,
      { status: statut }, // Met à jour le champ `status` de `Appointment`
      { new: true, runValidators: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ error: "Appointment non trouvé" });
    }

    console.log("Appointment après mise à jour :", updatedAppointment);



    if (statut === "Terminé") {
      const prestationPrix = Number(updatedAppointment.prestation.prix);
      console.log(
        "Structure de updatedAppointment.prestation :",
        updatedAppointment.prestation
      );

      //const prestationPrix = updatedAppointment.prestation.prix; // Récupérer le prix de la prestation
      const clientId = updatedAppointment.user._id; // Récupérer l'ID du client

      // Vérification si `prestationPrix` est un nombre valide
      console.log("Prix de la prestation récupéré :", prestationPrix);
      if (isNaN(prestationPrix) || prestationPrix <= 0) {
        return res
          .status(400)
          .json({ error: "Prix de la prestation invalide" });
      }

      // Récupérer le portefeuille du client
      const wallet = await Wallet.findOne({ user: clientId });

      if (!wallet) {
        return res
          .status(404)
          .json({ error: "Portefeuille du client non trouvé" });
      }

      // Vérifier si le client a assez d'argent
      console.log("Portefeuille avant mise à jour :", wallet);
      if (wallet.money < prestationPrix) {
        return res.status(400).json({ error: "Fonds insuffisants" });
      }

      // Déduire le montant de la prestation du portefeuille du client
      wallet.money -= prestationPrix;

      // Vérifier que le montant du portefeuille est un nombre valide
      if (isNaN(wallet.money) || wallet.money < 0) {
        return res
          .status(400)
          .json({ error: "Erreur lors de la mise à jour du portefeuille" });
      }
      await wallet.save(); // Sauvegarder la mise à jour du portefeuille
      console.log("Portefeuille mis à jour :", wallet);
    }

    res.status(200).json({
      message: "Statut mis à jour avec succès",
      tacheMecano: updatedTacheMecano,
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    res.status(400).json({ error: error.message });
  }
};*/

exports.getAllDetails = async (req, res) => {
  try {
    const data = await TacheMecano.find()
      .populate({
        path: "appointment",
        populate: [
          { path: "auto" }, // Peuple l'auto
          { path: "prestation" }, // Peuple la prestation
        ],
      })
      .populate("user"); // Populer les infos de l'utilisateur

    // Accédez au prix de la prestation dans chaque tâche

    res.json(data);
    //res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Une erreur s'est produite." });
  }
};

exports.createTacheMecano = async (req, res) => {
  try {
    const tacheMecano = new TacheMecano(req.body);
    await tacheMecano.save();
    res.status(201).send(tacheMecano);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getAllTacheMecano = async (req, res) => {
  try {
    const tacheMecano = await TacheMecano.find();
    res.status(200).send(tacheMecano);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getTacheMecanoById = async (req, res) => {
  try {
    const tacheMecano = await TacheMecano.findById(req.params.id);
    if (!tacheMecano) {
      return res.status(404).send();
    }
    res.status(200).send(tacheMecano);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateTacheMecano = async (req, res) => {
  try {
    const tacheMecano = await TacheMecano.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!tacheMecano) {
      return res.status(404).send();
    }
    res.status(200).send(tacheMecano);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Supprimer un utilisateur par ID
exports.deleteTacheMecano = async (req, res) => {
  try {
    const tacheMecano = await TacheMecano.findByIdAndDelete(req.params.id);
    if (!tacheMecano) {
      return res.status(404).send();
    }
    res.status(200).send(tacheMecano);
  } catch (error) {
    res.status(500).send(error);
  }
};
