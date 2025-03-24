const Pieces = require("../models/pieces");

exports.createPieces = async (req, res) => {
  try {
    const pieces = new Pieces(req.body);
    await pieces.save();
    res.status(201).send(pieces);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getAllPieces = async (req, res) => {
  try {
    const pieces = await Pieces.find();
    res.status(200).send(pieces);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getPiecesById = async (req, res) => {
  try {
    const pieces = await Pieces.findById(req.params.id);
    if (!pieces) {
      return res.status(404).send();
    }
    res.status(200).send(pieces);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updatePieces = async (req, res) => {
  try {
    const pieces = await Pieces.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!pieces) {
      return res.status(404).send();
    }
    res.status(200).send(pieces);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deletePieces = async (req, res) => {
  try {
    const pieces = await Pieces.findByIdAndDelete(req.params.id);
    if (!pieces) {
      return res.status(404).send();
    }
    res.status(200).send(pieces);
  } catch (error) {
    res.status(500).send(error);
  }
};
