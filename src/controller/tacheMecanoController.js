const TacheMecano = require("../models/tacheMecano");

const Appointment = require("../models/appointment");

exports.updateStatut = async (req, res) => {
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

    res.status(200).json({
      message: "Statut mis à jour avec succès",
      tacheMecano: updatedTacheMecano,
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    res.status(400).json({ error: error.message });
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

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Une erreur s'est produite." });
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
