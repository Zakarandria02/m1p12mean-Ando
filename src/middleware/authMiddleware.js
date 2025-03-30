const jwt = require("jsonwebtoken");

/*exports.verifyToken = (req, res, next) => {
  console.log("Headers Authorization:", req.headers.authorization); // Vérifier le token reçu

  const token = req.headers["authorization"]?.split(" ")[1]; // Extraction du token
  console.log("Token extrait:", token);

  if (!token) {
    console.log("Aucun token trouvé !");
    return next(); // Passe au middleware suivant (mais `req.userId` restera undefined)
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Erreur de vérification du token:", err.message);
      return res.status(401).send({ message: "Token invalide." });
    }

    req.userId = decoded.userId; // Stocke l'ID de l'utilisateur dans req.userId
    console.log("Utilisateur authentifié avec userId:", req.userId);
    next();
  });
};*/

/*exports.verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extraction du token

  if (!token) {
    console.log("Aucun token fourni, utilisateur non connecté.");
    return next(); // Permet de continuer sans erreur
  }

  jwt.verify(token, process.env.JWT_SECRET || "Mon Token", (err, decoded) => {
    if (err) {
      console.log("Token invalide.");
      return res.status(401).send({ message: "Token invalide." });
    }

    console.log("Utilisateur authentifié :", decoded);
    req.userId = decoded.userId;
    req.profile = decoded.profile; // Si nécessaire
    req.isAdmin = decoded.isAdmin; // Si nécessaire

    next();
  });
};*/

/*1er Cas Vraie*/

/*exports.verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extraction du token

  if (!token) {
    return next(); // Si aucun token, passer au middleware suivant
  }

  jwt.verify(token, process.env.JWT_SECRET || "Mon Token", (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Token invalide." });
    }

    req.userId = decoded.userId;
    req.profile = decoded.profile;
    req.isAdmin = decoded.isAdmin;
    next();
  });
};*/

exports.verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).send({ message: "Aucun token fourni." });
  }

  jwt.verify(token, process.env.JWT_SECRET || "Mon Token", (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Token invalide." });
    }

    // Ajout des informations de l'utilisateur à req pour que le contrôleur puisse les utiliser
    req.userId = decoded.userId; // Assurez-vous que le userId est dans le payload du token
    req.profile = decoded.profile;
    req.isAdmin = decoded.isAdmin;
    next();
  });
};

/*const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).send({ message: "Aucun token fourni." });
  }

  jwt.verify(token, process.env.JWT_SECRET || "Mon Token", (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Token invalide." });
    }

    req.userId = decoded.userId;
    req.profile = decoded.profile;
    req.isAdmin = decoded.isAdmin;
    next();
  });
};
*/
