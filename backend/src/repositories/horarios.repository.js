const db = require("../db/db");

// Obtener todos los horarios con info del nombre de la clase
const findAll = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT h.id, h.clase_id, h.dia, h.hora_inicio, h.hora_fin, h.descripcion, h.activa,
             c.nombre AS clase_nombre
      FROM Horarios h
      LEFT JOIN Clases c ON h.clase_id = c.id
      ORDER BY h.dia, h.hora_inicio
    `;
    db.all(sql, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Obtener horario por ID
const findById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT h.id, h.clase_id, h.dia, h.hora_inicio, h.hora_fin, h.descripcion, h.activa,
             c.nombre AS clase_nombre
      FROM Horarios h
      LEFT JOIN Clases c ON h.clase_id = c.id
      WHERE h.id = ?
    `;
    db.get(sql, [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Crear horario
const create = (horario) => {
  const {
    clase_id,
    dia,
    hora_inicio,
    hora_fin,
    descripcion,
    activa = 1,
  } = horario;
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO Horarios (clase_id, dia, hora_inicio, hora_fin, descripcion, activa)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [clase_id, dia, hora_inicio, hora_fin, descripcion ?? null, activa],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      }
    );
  });
};

// Actualizar horario
const update = (id, horario) => {
  const allowed = new Set([
    "clase_id",
    "dia",
    "hora_inicio",
    "hora_fin",
    "descripcion",
    "activa",
  ]);
  const fields = [];
  const values = [];

  for (const key in horario) {
    if (!allowed.has(key)) continue;
    fields.push(`${key} = ?`);
    values.push(horario[key]);
  }

  if (fields.length === 0) return Promise.resolve({ changes: 0 });

  values.push(id);

  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE Horarios SET ${fields.join(", ")} WHERE id = ?`,
      values,
      function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      }
    );
  });
};

// Eliminar horario
const remove = (id) => {
  return new Promise((resolve, reject) => {
    // Primero borrar inscripciones que apunten a este horario
    db.run(`DELETE FROM Inscripciones WHERE horario_id = ?`, [id], (err1) => {
      if (err1) return reject(err1);

      // No borramos Pagos por horario_id porque Pagos no tiene ese campo
      db.run(`DELETE FROM Horarios WHERE id = ?`, [id], function (err2) {
        if (err2) return reject(err2);
        resolve({ changes: this.changes });
      });
    });
  });
};

module.exports = { findAll, findById, create, update, remove };
