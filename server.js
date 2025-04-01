require("dotenv").config();
console.log("JWT_SECRET:", process.env.JWT_SECRET);

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const userRoutes = require("./src/routes/userRoutes");
const autoRoutes = require("./src/routes/autoRoutes");
const authRoutes = require("./src/routes/authRoutes");
const piecesRoutes = require("./src/routes/piecesRoutes");
const pieceClientRoutes = require("./src/routes/pieceClientRoutes");
const prestationRoutes = require("./src/routes/prestationRoutes");
const appointmentRoutes = require("./src/routes/appointmentRoutes");
const tacheMecanoRoutes = require("./src/routes/tacheMecanoRoutes");
const portefeuilleRoutes = require("./src/routes/portefeuilleRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/autos", autoRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/pieces", piecesRoutes);
app.use("/api/pieceClient", pieceClientRoutes);
app.use("/api/prestations", prestationRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/tacheMecano", tacheMecanoRoutes);
app.use("/api/money", portefeuilleRoutes);

app.use(express.json());

// Route pour la racine
app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API CRUD !");
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
