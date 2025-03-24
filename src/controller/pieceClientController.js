const PieceClient = require("../models/piecesClient");

exports.createPieceClient = async (req, res) => {
  try {
    const { codearticle, marque, reference, lib, prix, Qte, user } = req.body;

    // Vérifier que tous les champs sont fournis
    if (
      !codearticle ||
      !marque ||
      !reference ||
      !lib ||
      !prix ||
      !Qte ||
      !user
    ) {
      return res.status(400).json({ message: "Tous les champs sont requis !" });
    }

    // Convertir prix et Qte en nombre (évite les erreurs de type)
    const prixNumber = parseFloat(prix);
    const QteNumber = parseInt(Qte, 10);

    if (isNaN(prixNumber) || isNaN(QteNumber)) {
      return res
        .status(400)
        .json({ message: "Prix et Qte doivent être des nombres valides !" });
    }

    const pieceClient = new PieceClient({
      codearticle,
      marque,
      reference,
      lib,
      prix: prixNumber,
      Qte: QteNumber,
      user,
    });

    await pieceClient.save();
    res.status(201).json(pieceClient);
  } catch (error) {
    console.error("Erreur serveur:", error); // Ajout du log pour voir l'erreur exacte
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.getAllPieceClient = async (req, res) => {
  try {
    const pieceClient = await PieceClient.find();
    res.status(200).send(pieceClient);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getPieceClientById = async (req, res) => {
  try {
    const pieceClient = await PieceClient.findById(req.params.id);
    if (!pieceClient) {
      return res.status(404).send();
    }
    res.status(200).send(pieceClient);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updatePieceClient = async (req, res) => {
  try {
    const pieceClient = await PieceClient.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!pieceClient) {
      return res.status(404).send();
    }
    res.status(200).send(pieceClient);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Supprimer un utilisateur par ID
exports.deletePieceClient = async (req, res) => {
  try {
    const pieceClient = await PieceClient.findByIdAndDelete(req.params.id);
    if (!pieceClient) {
      return res.status(404).send();
    }
    res.status(200).send(pieceClient);
  } catch (error) {
    res.status(500).send(error);
  }
};
