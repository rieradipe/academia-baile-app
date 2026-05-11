const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const DATA_DIR = path.join(__dirname, "../../data");
const DB_PATH = path.join(DATA_DIR, "academia.db");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("Error al abrir la base de datos:", err.message);
  } else {
    console.log("Base de datos abierta correctamente en", DB_PATH);
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS Alumnas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      apellidos TEXT,
      dni TEXT,
      numero_ss TEXT,
      telefono TEXT,
      email TEXT,
      fecha_nacimiento TEXT,
      fecha_inscripcion TEXT,
      observaciones TEXT,
      activa INTEGER DEFAULT 1,
      pagado INTEGER DEFAULT 0
    )
  `);
  const addColumnIfMissing = (table, column, definition) => {
    db.run(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`, (err) => {
      if (err && !err.message.includes("duplicate column name")) {
        console.error(`Error añadiendo columna ${column}:`, err.message);
      }
    });
  };

  addColumnIfMissing("alumnas", "apellidos", "TEXT");
  addColumnIfMissing("alumnas", "dni", "TEXT");
  addColumnIfMissing("alumnas", "numero_ss", "TEXT");
  addColumnIfMissing("alumnas", "fecha_nacimiento", "TEXT");
  addColumnIfMissing("alumnas", "fecha_inscripcion", "TEXT");
  addColumnIfMissing("alumnas", "observaciones", "TEXT");
  addColumnIfMissing("alumnas", "pagado", "INTEGER DEFAULT 0");

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

  // 👇 NUEVA TABLA HORARIOS
  db.run(`
    CREATE TABLE IF NOT EXISTS Horarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      clase_id INTEGER NOT NULL,
      dia TEXT NOT NULL,
      hora_inicio TEXT NOT NULL,
      hora_fin TEXT NOT NULL,
      descripcion TEXT,
      activa INTEGER DEFAULT 1,
      FOREIGN KEY(clase_id) REFERENCES Clases(id)
    )
  `);

  // 👇 INSCRIPCIONES ACTUALIZADA
  db.run(`
    CREATE TABLE IF NOT EXISTS Inscripciones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      alumna_id INTEGER NOT NULL,
      horario_id INTEGER NOT NULL,
      fecha_inscripcion TEXT,
      FOREIGN KEY(alumna_id) REFERENCES Alumnas(id),
      FOREIGN KEY(horario_id) REFERENCES Horarios(id)
    )
  `);

  console.log("📁 DB PATH:", DB_PATH);
});

module.exports = db;
