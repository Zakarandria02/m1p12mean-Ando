const TacheMecano = require("../models/tacheMecano");
const Appointment = require("../models/appointment");
const Wallet = require("../models/portefeuille");
const User = require("../models/user");

exports.updateStatut = async (req, res) => {
  try {
    const { statut } = req.body;
    const { id } = req.params;

    // Vérifier si l'appointment existe
    const currentAppointment = await Appointment.findById(id);
    if (!currentAppointment) {
      return res.status(404).json({ error: "Rendez-vous non trouvé." });
    }

    // Vérifier la transition de statut
    if (currentAppointment.status === "En Attente" && statut === "En Cours") {
      if (currentAppointment.paiement === "Impayé") {
        return res.status(400).json({
          error:
            "Impossible de passer le rendez-vous en 'En Cours' tant que le paiement est 'Impayé'.",
        });
      }
    }

    // Mettre à jour uniquement le statut, en ignorant le champ 'date'
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { $set: { status: statut } },
      { new: true, fields: { date: 0 } } // Exclut le champ 'date'
    );

    res.status(200).json({
      message: "Statut du rendez-vous mis à jour avec succès.",
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    res.status(500).json({ error: "Une erreur interne est survenue." });
  }
};

// exports.updateStatut = async (req, res) => {
//   try {
//     const { statut } = req.body;
//     const { id } = req.params;

//     // Récupérer l'appointment actuel
//     const currentAppointment = await Appointment.findById(id);
//     if (!currentAppointment) {
//       return res.status(404).json({ error: "Rendez-vous non trouvé." });
//     }

//     // Vérifier si le statut actuel est "En Attente" et le paiement est "Impayé"
//     if (currentAppointment.status === "En Attente" && statut === "En Cours") {
//       if (currentAppointment.paiement === "Impayé") {
//         return res.status(400).json({
//           error:
//             "Impossible de passer le rendez-vous en 'En Cours' tant que le paiement est 'Impayé'.",
//         });
//       }
//     }

//     // Mettre à jour le statut de l'appointment
//     currentAppointment.status = statut;
//     //currentAppointment.$ignore("date");
//     await currentAppointment.save();

//     res.status(200).json({
//       message: "Statut du rendez-vous mis à jour avec succès.",
//       appointment: currentAppointment,
//     });
//   } catch (error) {
//     console.error("Erreur lors de la mise à jour :", error);
//     res.status(500).json({ error: "Une erreur interne est survenue." });
//   }
// };

// exports.updateStatut = async (req, res) => {
//   try {
//     const { statut } = req.body;
//     const { id } = req.params;

//     // Récupérer l'appointment actuel
//     const currentAppointment = await Appointment.findById(id);
//     if (!currentAppointment) {
//       return res.status(404).json({ error: "Rendez-vous non trouvé." });
//     }

//     // Vérifier si le statut actuel est "En Attente"
//     // if (currentAppointment.status !== "En Attente") {
//     //   return res
//     //     .status(400)
//     //     .json({
//     //       error:
//     //         "Le statut de ce rendez-vous ne peut être modifié que s'il est actuellement 'En Attente'.",
//     //     });
//     // }

//     // Si le nouveau statut est "En Cours", vérifier le statut du paiement
//     if (statut === "En Cours") {
//       // Récupérer le paiement associé à l'appointment
//       const payement = await Payement.findOne({ appointment: id });
//       if (!payement) {
//         return res
//           .status(404)
//           .json({ error: "Paiement associé au rendez-vous non trouvé." });
//       }

//       // Vérifier si le statut du paiement est "Impayé"
//       if (payement.statut === "Impayé") {
//         return res.status(400).json({
//           error:
//             "Impossible de passer le rendez-vous en 'En Cours' tant que le paiement est 'Impayé'.",
//         });
//       }
//     }

//     // Mettre à jour le statut de l'appointment
//     currentAppointment.status = statut;
//     await currentAppointment.save();

//     res.status(200).json({
//       message: "Statut du rendez-vous mis à jour avec succès.",
//       appointment: currentAppointment,
//     });
//   } catch (error) {
//     console.error("Erreur lors de la mise à jour :", error);
//     res.status(500).json({ error: "Une erreur interne est survenue." });
//   }
// };

/*Fonction getTacheMecanoById prend les liste des taches mecano par id mecanicien */

exports.getTacheMecanoById = async (req, res) => {
  try {
    const { id } = req.params; // ID de l'utilisateur (mécanicien)

    // Vérifier si l'utilisateur est un mécanicien
    const user = await User.findById(id);
    if (!user || user.role !== "mechanic") {
      return res.status(403).json({ error: "Accès refusé, rôle invalide." });
    }

    // Récupérer les tâches mécano liées à ce mécanicien
    const tachesMecano = await TacheMecano.find({ user: id })
      .populate({
        path: "appointment",
        populate: [
          { path: "prestation" }, // Peuple la prestation
          { path: "user" }, // Peuple le client
          { path: "auto" }, // Peuple l'auto liée au rendez-vous
        ],
      })
      .populate("user"); // Peuple les infos du mécanicien

    if (!tachesMecano || tachesMecano.length === 0) {
      return res
        .status(404)
        .json({ error: "Aucune tâche trouvée pour ce mécanicien." });
    }

    res.status(200).json(tachesMecano);
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches :", error);
    res.status(500).json({ error: "Une erreur interne est survenue." });
  }
};

/*Fonction getAllDetails */
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
/**Fonction getFacture qui liste tous les facture des client */
exports.getFacture = async (req, res) => {
  try {
    const data = await TacheMecano.find()
      .populate({
        path: "appointment",
        populate: [
          { path: "auto" }, // Peuple la voiture
          { path: "prestation" }, // Peuple la prestation
          { path: "user" }, // Peuple l'utilisateur
        ],
      })
      .populate("user"); // Popule aussi l'utilisateur lié à `TacheMecano`

    // Vérifier si des tâches existent
    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Aucune facture trouvée." });
    }

    // Récupérer les IDs des utilisateurs pour chercher leurs portefeuilles
    const userIds = data
      .map((tache) => tache.appointment?.user?._id)
      .filter(Boolean);

    // Récupérer les portefeuilles des utilisateurs trouvés
    const wallets = await Wallet.find({ user: { $in: userIds } });

    // Associer chaque portefeuille au bon utilisateur
    const walletMap = wallets.reduce((acc, wallet) => {
      acc[wallet.user.toString()] = wallet;
      return acc;
    }, {});

    // Ajouter les portefeuilles aux données finales
    const result = data.map((tache) => ({
      ...tache.toObject(),
      appointment: {
        ...tache.appointment.toObject(),
        portefeuille:
          walletMap[tache.appointment?.user?._id.toString()] || null,
      },
    }));

    console.log("✅ Factures récupérées :", JSON.stringify(result, null, 2));
    return res.json(result);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des factures :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des factures." });
  }
};
/**Fonction getFactureClient qui retourne la facture du client présent */
exports.getFactureClient = async (req, res) => {
  try {
    const { id } = req.params; // ID du client

    // Vérifier si l'utilisateur est bien un client
    const user = await User.findById(id);
    if (!user || user.role !== "client") {
      return res.status(403).json({ error: "Accès refusé, rôle invalide." });
    }

    // Récupérer les tâches mécano liées à ce client via l'appointment
    const tachesMecano = await TacheMecano.find()
      .populate({
        path: "appointment",
        match: { user: id }, // Filtre pour ne récupérer que les rendez-vous du client
        populate: [
          { path: "auto" }, // Peuple la voiture
          { path: "prestation" }, // Peuple la prestation
          { path: "user" }, // Peuple les infos du client
        ],
      })
      .populate("user"); // Peuple les infos du mécanicien lié à `TacheMecano`

    // Filtrer pour ne garder que les tâches où `appointment` n'est pas null
    const factures = tachesMecano.filter((tache) => tache.appointment);

    if (!factures || factures.length === 0) {
      return res.status(404).json({ error: "Aucune facture trouvée." });
    }

    // Récupérer le portefeuille du client
    const wallet = await Wallet.findOne({ user: id });

    // Ajouter le portefeuille aux données finales
    const result = factures.map((tache) => ({
      ...tache.toObject(),
      appointment: {
        ...tache.appointment.toObject(),
        portefeuille: wallet || null, // Ajoute le portefeuille s'il existe
      },
    }));

    console.log(
      "✅ Factures du client récupérées :",
      JSON.stringify(result, null, 2)
    );
    return res.json(result);
  } catch (error) {
    console.error(
      " Erreur lors de la récupération des factures client :",
      error
    );
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des factures." });
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
