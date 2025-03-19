const Auto = require("../models/auto");
// Créer un utilisateur
exports.createAuto = async (req, res) => {
  try {
    const auto = new Auto(req.body);
    await auto.save();
    res.status(201).send(auto);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Lire tous les utilisateurs
exports.getAllAutos = async (req, res) => {
  try {
    const autos = await Auto.find();
    res.status(200).send(autos);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Lire un utilisateur par ID
exports.getAutoById = async (req, res) => {
  try {
    const auto = await Auto.findById(req.params.id);
    if (!auto) {
      return res.status(404).send();
    }
    res.status(200).send(auto);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Mettre à jour un utilisateur par ID
exports.updateAuto = async (req, res) => {
  try {
    const auto = await Auto.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!auto) {
      return res.status(404).send();
    }
    res.status(200).send(auto);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Supprimer un utilisateur par ID
exports.deleteAuto = async (req, res) => {
  try {
    const auto = await Auto.findByIdAndDelete(req.params.id);
    if (!auto) {
      return res.status(404).send();
    }
    res.status(200).send(auto);
  } catch (error) {
    res.status(500).send(error);
  }
};
