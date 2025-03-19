const jwt = require("jsonwebtoken");

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
