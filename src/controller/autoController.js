const Auto = require("../models/auto");

exports.createAuto = async (req, res) => {
  try {
    const { marque, modele, annee } = req.body;

    if (!marque || !modele || !annee) {
      return res.status(400).json({ message: "Tous les champs sont requis !" });
    }

    const newAuto = new Auto({
      marque,
      modele,
      annee,
      user,
    });

    await newAuto.save();
    res.status(201).json(newAuto);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
/*exports.createAuto = async (req, res) => {
  try {
    const auto = new Auto(req.body);
    await auto.save();
    res.status(201).send(auto);
  } catch (error) {
    res.status(400).send(error);
  }
};*/

exports.getAllAutos = async (req, res) => {
  try {
    const autos = await Auto.find();
    res.status(200).send(autos);
  } catch (error) {
    res.status(500).send(error);
  }
};

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
