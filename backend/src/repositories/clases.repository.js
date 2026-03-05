const db = require("../db/db");

// obtener todas las clases
const findAll = () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM Clases WHERE activa = 1", [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};
// obtener clase por id

const findById = (id) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM Clases WHERE id = ?", [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};
// crear clase

const create = (clase) => {
  const { nombre, descripcion, precio, cupo, dias, hora_inicio, hora_fin } =
    clase;

  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO Clases
         (nombre, descripcion, precio, cupo, dias, hora_inicio, hora_fin)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nombre, descripcion, precio, cupo, dias, hora_inicio, hora_fin],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      }
    );
  });
};
// actualizar clase

const update = (id, clase) => {
  const fields = [];
  const values = [];

  for (const key in clase) {
    fields.push(`${key} = ?`);
    values.push(clase[key]);
  }

  values.push(id);

  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE Clases SET ${fields.join(", ")} WHERE id = ?`,
      values,
      function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      }
    );
  });
};
// eliminar clase
const remove = (id) => {
  return new Promise((resolve, reject) => {
    db.run("UPDATE Clases SET activa = 0 WHERE id = ?", [id], function (err) {
      if (err) reject(err);
      else resolve({ changes: this.changes });
    });
  });
};

module.exports = { findAll, findById, create, update, remove };
