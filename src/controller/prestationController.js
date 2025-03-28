const Prestation = require("../models/prestation");

exports.createPrestation = async (req, res) => {
  try {
    const prestation = new Prestation(req.body);
    await prestation.save();
    res.status(201).send(prestation);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getAllPrestation = async (req, res) => {
  try {
    const prestation = await Prestation.find();
    res.status(200).send(prestation);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getPrestationById = async (req, res) => {
  try {
    const prestation = await Prestation.findById(req.params.id);
    if (!prestation) {
      return res.status(404).send();
    }
    res.status(200).send(prestation);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updatePrestation = async (req, res) => {
  try {
    const prestation = await Prestation.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!prestation) {
      return res.status(404).send();
    }
    res.status(200).send(prestation);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deletePrestation = async (req, res) => {
  try {
    const prestation = await Prestation.findByIdAndDelete(req.params.id);
    if (!prestation) {
      return res.status(404).send();
    }
    res.status(200).send(prestation);
  } catch (error) {
    res.status(500).send(error);
  }
};
