const db = require("../db/db");

// Obtener todos los pagos (opcional: filtrados por mes YYYY-MM)
const findAll = (mes) => {
  return new Promise((resolve, reject) => {
    const hasMes = typeof mes === "string" && /^\d{4}-\d{2}$/.test(mes);

    const sql = hasMes
      ? `
        SELECT p.id, p.alumna_id, p.fecha, p.importe, p.concepto, p.estado
        FROM Pagos p
        WHERE strftime('%Y-%m', p.fecha) = ?
        ORDER BY p.fecha DESC
      `
      : `
        SELECT p.id, p.alumna_id, p.fecha, p.importe, p.concepto, p.estado
        FROM Pagos p
        ORDER BY p.fecha DESC
      `;

    const params = hasMes ? [mes] : [];

    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

// Obtener pago por ID
const findById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT p.id, p.alumna_id, p.fecha, p.importe, p.concepto, p.estado
      FROM Pagos p
      WHERE p.id = ?
    `;
    db.get(sql, [id], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
};

// Crear pago
const create = (pago) => {
  const { alumna_id, fecha, importe, concepto, estado = "pendiente" } = pago;

  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO Pagos (alumna_id, fecha, importe, concepto, estado)
       VALUES (?, ?, ?, ?, ?)`,
      [
        alumna_id,
        fecha || new Date().toISOString().slice(0, 10),
        importe,
        concepto ?? null,
        estado,
      ],
      function (err) {
        if (err) return reject(err);
        resolve({
          id: this.lastID,
          alumna_id,
          fecha: fecha || new Date().toISOString().slice(0, 10),
          importe,
          concepto: concepto ?? null,
          estado,
        });
      }
    );
  });
};

// Actualizar pago (parcial) - solo campos permitidos
const update = (id, pago) => {
  const allowed = new Set([
    "alumna_id",
    "fecha",
    "importe",
    "concepto",
    "estado",
  ]);
  const fields = [];
  const values = [];

  for (const key in pago) {
    if (!allowed.has(key)) continue;
    fields.push(`${key} = ?`);
    values.push(pago[key]);
  }

  if (fields.length === 0) {
    return Promise.resolve({ changes: 0 });
  }

  values.push(id);

  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE Pagos SET ${fields.join(", ")} WHERE id = ?`,
      values,
      function (err) {
        if (err) return reject(err);
        resolve({ changes: this.changes });
      }
    );
  });
};

// Eliminar pago
const remove = (id) => {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM Pagos WHERE id = ?`, [id], function (err) {
      if (err) return reject(err);
      resolve({ changes: this.changes });
    });
  });
};

module.exports = { findAll, findById, create, update, remove };
