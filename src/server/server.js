const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoutes = require("../routes/userRoutes");
const autoRoutes = require("../routes/autoRoutes");
const authRoutes = require("../routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connexion à MongoDB
mongoose
  .connect("mongodb://localhost:27017/mean-crud")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

// Routes
app.use("/api/users", userRoutes);
app.use("/api/autos", autoRoutes);
app.use("/api/auth", authRoutes);

// Route pour la racine
app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API CRUD !");
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
/*const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const personneRoutes = require("../routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connexion à MongoDB
mongoose.set("debug", true);
mongoose
  .connect("mongodb://localhost:27017/mean-crud")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

// Route pour la racine
app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API CRUD !");
});

// Routes
app.use("/api/user", personneRoutes);

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
*/
