const fs = require("fs");
const path = require("path");

// DB real (misma que usa el server)
const dbFile = path.resolve(__dirname, "../../data/academia.db");

// Carpeta de backups junto a tasks
const backupFolder = path.resolve(__dirname, "backups");

// Asegura carpeta (robusto)
fs.mkdirSync(backupFolder, { recursive: true });

const backup = () => {
  try {
    if (!fs.existsSync(dbFile)) {
      console.error("❌ No se encontró la base de datos:", dbFile);
      return;
    }

    const date = new Date();
    const filename = `backup-${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}.sqlite`;

    const dest = path.join(backupFolder, filename);

    // Copia sincrónica para evitar carreras al arrancar
    fs.copyFileSync(dbFile, dest);

    console.log("✅ Backup creado (resetPagos):", dest);
  } catch (err) {
    console.error("❌ Error al hacer backup (resetPagos):", err);
  }
};

module.exports = backup;
