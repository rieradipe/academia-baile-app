console.log("🧩 BACKUP FILE:", __filename);

const fs = require("fs");
const path = require("path");

module.exports = function backup() {
  try {
    const dbFile = path.resolve(__dirname, "../../data/academia.db");

    if (!fs.existsSync(dbFile)) {
      console.error("No se encontró la base de datos:", dbFile);
      return;
    }

    console.log("Backup ejecutándose desde:", __dirname);
    console.log("Archivo DB usado:", dbFile);

    // ===== Backup local =====
    const localBackupFolder = path.resolve(__dirname, "backups");
    fs.mkdirSync(localBackupFolder, { recursive: true });

    const now = new Date();
    const filename = `backup-${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}-${String(
      now.getHours()
    ).padStart(2, "0")}-${String(now.getMinutes()).padStart(2, "0")}-${String(
      now.getSeconds()
    ).padStart(2, "0")}.sqlite`;

    const localBackupFile = path.join(localBackupFolder, filename);
    console.log("🧩 dbFile =", dbFile);
    console.log("🧩 localBackupFile =", localBackupFile);

    fs.copyFileSync(dbFile, localBackupFile);
    console.log("✅ Backup local creado:", localBackupFile);

    // =========================================================
    // BACKUP USB (DESACTIVADO)
    // =========================================================
    // macOS monta los discos/USB en: /Volumes/<NOMBRE_DEL_USB>
    // Ejemplo: si el USB se llama "KINGSTON", la ruta será:
    //   /Volumes/KINGSTON
    //
    // Para ver el nombre exacto del USB en macOS:
    //   1) Conecta el USB
    //   2) Ejecuta en terminal:  ls /Volumes
    //   3) Verás algo como:
    //        Macintosh HD
    //        KINGSTON
    //      → tu USB sería: /Volumes/KINGSTON
    //
    // IMPORTANTE:
    // - "Macintosh HD" suele ser el disco interno, NO queremos copiar ahí.
    // - Si tienes más de un disco externo, este código (si se activa) elige
    //   el primero que encuentre distinto de "Macintosh HD".
    //
    // Si quieres activarlo más adelante:
    // - Quita los comentarios del bloque de abajo
    // - Asegúrate de que el USB esté conectado y montado

    /*
    const volumesPath = "/Volumes";
    let usbRoot = null;

    if (fs.existsSync(volumesPath)) {
      const mounts = fs
        .readdirSync(volumesPath, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => path.join(volumesPath, d.name))
        .filter((p) => path.basename(p) !== "Macintosh HD");

      usbRoot = mounts[0] || null;
    }

    if (usbRoot) {
      const usbBackupFolder = path.join(usbRoot, "backups");
      fs.mkdirSync(usbBackupFolder, { recursive: true });

      const usbBackupFile = path.join(usbBackupFolder, filename);
      console.log("🧩 usbRoot =", usbRoot);
      console.log("🧩 usbBackupFile =", usbBackupFile);

      fs.copyFileSync(dbFile, usbBackupFile);
      console.log("✅ Backup USB creado:", usbBackupFile);
    } else {
      console.log("ℹ️ USB no detectado en /Volumes, se omite backup USB");
    }
    */
  } catch (err) {
    console.error("❌ Error al crear backup:", err);
  }
};
