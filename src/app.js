const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
require("dotenv").config();

const { initDb } = require("./models");
const authRoutes = require("./routes/authRoutes");
const fileRoutes = require("./routes/fileRoutes");
const healthRoutes = require("./routes/health");
const storageRoutes = require("./routes/storageRoutes");

const app = express();

// Ajout de logs pour le débogage
console.log("Starting application...");
console.log("Environment:", process.env.NODE_ENV);
console.log("Port:", process.env.PORT);

// Middleware de base
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(cors());
app.use(express.json({ limit: "2gb" }));
app.use(express.urlencoded({ extended: true, limit: "2gb" }));
app.use(express.raw({ limit: "2gb" }));

// Dossier pour les fichiers uploadés
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/storage", storageRoutes);

// Route de test
app.get("/", (req, res) => {
  console.log("Root route accessed");
  res.json({
    message: "Welcome to SweTransfer API",
    status: "running",
  });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error("Error occurred:", err);
  res.status(500).json({
    message: "Something broke!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal Server Error",
  });
});

const startServer = async () => {
  try {
    console.log("Initializing database...");
    const dbInitialized = await initDb();

    if (!dbInitialized) {
      console.error("Failed to initialize database. Retrying in 5 seconds...");
      setTimeout(startServer, 5000);
      return;
    }

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Server startup error:", error);
    process.exit(1);
  }
};

// Gestion des erreurs non capturées
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  console.error(error.stack);
  // Attendre un peu avant de quitter
  setTimeout(() => process.exit(1), 1000);
});

startServer();
