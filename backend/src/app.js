const express = require("express");
const cors = require("cors");

const alumnasRoutes = require("./routes/alumnas.routes");
const clasesRoutes = require("./routes/clases.routes");
const pagosRoutes = require("./routes/pagos.routes");
const inscripcionesRoutes = require("./routes/inscripciones.routes");
const horariosRoutes = require("./routes/horarios.routes");

const scheduleResetPagos = require("./tasks/resetPagos");
const backup = require("./tasks/backup");

const cron = require("node-cron");

const app = express();

/* =====================
   Middlewares
===================== */
app.use(express.json());
app.use(cors());

/* =====================
   Rutas
===================== */
app.use("/api/alumnas", alumnasRoutes);
app.use("/api/clases", clasesRoutes);
app.use("/api/pagos", pagosRoutes);
app.use("/api/inscripciones", inscripcionesRoutes);
app.use("/api/horarios", horariosRoutes);

/* =====================
   Tasks / Cron jobs
   (NO pueden tumbar el server)
===================== */

// Reset de pagos (día 1)
try {
  scheduleResetPagos();
  console.log("✔ Reset de pagos programado");
} catch (err) {
  console.error("✖ Error programando reset de pagos:", err.message);
}

// Backup (día 15 a las 00:00)
cron.schedule("0 0 15 * *", () => {
  try {
    console.log("⏳ Ejecutando backup del día 15...");
    backup();
  } catch (err) {
    console.error("✖ Error en backup:", err.message);
  }
});

module.exports = app;
