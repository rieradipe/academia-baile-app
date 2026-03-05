const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Ruta correcta de la BD dentro de data/
const DB_PATH = path.resolve("data", "academia.db");

// Abrir o crear la base de datos
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("Error al abrir la base de datos:", err.message);
  } else {
    console.log("Base de datos abierta correctamente en", DB_PATH);
  }
});

// Crear tablas mínimas si no existen
db.serialize(() => {
  // 👈 Tabla Alumnas
  db.run(`
    CREATE TABLE IF NOT EXISTS Alumnas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      telefono TEXT,
      email TEXT,
      activa INTEGER DEFAULT 1
    )
  `);

  // 👈 Tabla Pagos
  db.run(`
    CREATE TABLE IF NOT EXISTS Pagos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      alumna_id INTEGER NOT NULL,
      fecha TEXT NOT NULL,
      importe REAL NOT NULL,
      concepto TEXT,
      estado TEXT DEFAULT 'pendiente',
      FOREIGN KEY(alumna_id) REFERENCES Alumnas(id)
    )
  `);

  // 👈 Tabla Clases
  db.run(`
    CREATE TABLE IF NOT EXISTS Clases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      descripcion TEXT,
      precio REAL NOT NULL,
      cupo INTEGER,
      dias TEXT,
      hora_inicio TEXT,
      hora_fin TEXT,
      activa INTEGER DEFAULT 1
    )
  `);

  // tabla relacional entre alumnas y clases. Inscripciones
  db.run(`
  CREATE TABLE IF NOT EXISTS Inscripciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    alumna_id INTEGER NOT NULL,
    clase_id INTEGER NOT NULL,
    fecha_inscripcion TEXT,
    FOREIGN KEY(alumna_id) REFERENCES Alumnas(id),
    FOREIGN KEY(clase_id) REFERENCES Clases(id)

 )
  `);
});

module.exports = db;
