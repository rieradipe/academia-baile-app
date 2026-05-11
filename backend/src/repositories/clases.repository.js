const db = require("../db/db");

// obtener todas las clases
const findAll = (estado = "activas") => {
  return new Promise((resolve, reject) => {
    let sql = `
    SELECT 
      id,
      nombre,
      descripcion,
      COALESCE(precio, 0) as precio,
      COALESCE(cupo, 0) as cupo,
      COALESCE(dias, '') as dias,
      COALESCE(hora_inicio, '') as hora_inicio,
      COALESCE(hora_fin, '') as hora_fin,
      activa
    FROM Clases
    `;

    if (estado === "activas") {
      sql += " WHERE activa = 1";
    }

    if (estado === "inactivas") {
      sql += " WHERE activa = 0";
    }

    // 👇 filtro para quitar basura
    if (sql.includes("WHERE")) {
      sql += " AND nombre IS NOT NULL AND TRIM(nombre) != ''";
    }

    sql += " ORDER BY nombre ASC";

    console.log("🟣 SQL CLASES:", sql);

    db.all(sql, [], (err, rows) => {
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
const createHorarioForClase = (claseId, clase) => {
  const {
    dias = "Sin definir",
    hora_inicio = "00:00",
    hora_fin = "00:00",
    descripcion,
  } = clase;

  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO Horarios
        (clase_id, dia, hora_inicio, hora_fin, descripcion, activa)
       VALUES (?, ?, ?, ?, ?, 1)`,
      [
        claseId,
        dias || "Sin definir",
        hora_inicio || "00:00",
        hora_fin || "00:00",
        descripcion || "",
      ],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      }
    );
  });
};
module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
  createHorarioForClase,
};
