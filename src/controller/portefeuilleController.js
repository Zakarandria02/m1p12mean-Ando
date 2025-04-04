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

// Obtenir le portefeuille d'un utilisateur
exports.getPortefeuilleByUserId = async (req, res) => {
  try {
    const userId = req.params.id; // Assure-toi que la route a bien "/:userId/user"

    if (!userId) {
      return res.status(400).json({ error: "ID utilisateur manquant" });
    }

    const portefeuille = await Portefeuille.findOne({ user: userId });

    if (!portefeuille) {
      return res.status(404).json({ error: "Portefeuille non trouvé" });
    }

    res.json({ money: portefeuille.money });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Opérations sur le portefeuille
exports.getRetirerByUserId = async (req, res) => {
  try {
    const { operation } = req.params;
    const { userId, montant } = req.body;

    // Validation
    if (userId !== req.user._id) {
      return res.status(403).json({ error: "Accès non autorisé" });
    }

    if (montant <= 0) {
      return res.status(400).json({ error: "Montant invalide" });
    }

    let portefeuille = await Portefeuille.findOne({ user: userId });

    // Créer le portefeuille s'il n'existe pas
    if (!portefeuille) {
      portefeuille = new Portefeuille({ user: userId, money: 0 });
    }

    // Vérifier le solde pour les retraits
    if (operation === "retirer" && portefeuille.money < montant) {
      return res.status(400).json({ error: "Solde insuffisant" });
    }

    // Effectuer l'opération
    portefeuille.money += operation === "ajouter" ? montant : -montant;
    await portefeuille.save();

    res.json({ money: portefeuille.money });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
