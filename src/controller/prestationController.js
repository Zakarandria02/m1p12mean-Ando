const Prestation = require("../models/prestation");

// ✅ Ajouter une prestation (Admin seulement)
exports.createPrestation = async (req, res) => {
  try {
    const { nom, description, prix } = req.body;

    if (!nom || !prix) {
      return res.status(400).json({ message: "Nom et prix sont requis." });
    }

    const prestation = new Prestation({ nom, description, prix });
    await prestation.save();

    res.status(201).json({ success: true, prestation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Récupérer toutes les prestations
exports.getAllPrestations = async (req, res) => {
  try {
    const prestations = await Prestation.find();
    res.json(prestations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Récupérer une prestation par ID
exports.getPrestationById = async (req, res) => {
  try {
    const prestation = await Prestation.findById(req.params.id);
    if (!prestation) {
      return res.status(404).json({ message: "Prestation introuvable." });
    }
    res.json({ success: true, prestation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Modifier une prestation (Admin seulement)
exports.updatePrestation = async (req, res) => {
  try {
    const { nom, description, prix } = req.body;
    const prestation = await Prestation.findById(req.params.id);

    if (!prestation) {
      return res.status(404).json({ message: "Prestation introuvable." });
    }

    prestation.nom = nom || prestation.nom;
    prestation.description = description || prestation.description;
    prestation.prix = prix || prestation.prix;

    await prestation.save();
    res.json({ success: true, prestation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Supprimer une prestation (Admin seulement)
exports.deletePrestation = async (req, res) => {
  try {
    const prestation = await Prestation.findById(req.params.id);

    if (!prestation) {
      return res.status(404).json({ message: "Prestation introuvable." });
    }

    await prestation.deleteOne();
    res.json({ success: true, message: "Prestation supprimée." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
