const Portefeuille = require("../models/portefeuille");

exports.createPortefeuille = async (req, res) => {
  try {
    const portefeuille = new Portefeuille(req.body);
    await portefeuille.save();
    res.status(201).send(portefeuille);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getAllPortefeuille = async (req, res) => {
  try {
    const portefeuille = await Portefeuille.find();
    res.status(200).send(portefeuille);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getPortefeuilleById = async (req, res) => {
  try {
    const portefeuille = await Portefeuille.findById(req.params.id);
    if (!portefeuille) {
      return res.status(404).send();
    }
    res.status(200).send(portefeuille);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updatePortefeuille = async (req, res) => {
  try {
    const portefeuille = await Portefeuille.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!portefeuille) {
      return res.status(404).send();
    }
    res.status(200).send(portefeuille);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deletePortefeuille = async (req, res) => {
  try {
    const portefeuille = await Portefeuille.findByIdAndDelete(req.params.id);
    if (!portefeuille) {
      return res.status(404).send();
    }
    res.status(200).send(portefeuille);
  } catch (error) {
    res.status(500).send(error);
  }
};
