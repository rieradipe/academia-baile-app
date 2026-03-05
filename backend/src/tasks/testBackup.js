const fs = require("fs");
const path = require("path");

// Rutas absolutas basadas en este script
const dbFile = path.join(__dirname, "../data/academia.db");
const backupFile = path.join(__dirname, "backup/testBackup.sqlite");

try {
  fs.copyFileSync(dbFile, backupFile);
  console.log("Backup creado correctamente:", backupFile);

  const stats = fs.statSync(backupFile);
  console.log("Tamaño del backup:", stats.size, "bytes");
} catch (err) {
  console.error("Error al crear backup:", err.message);
}
