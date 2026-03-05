const db = require("../db/db");

// Obtener todas las inscripciones
const findAll = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT id, alumna_id, horario_id, fecha_inscripcion
      FROM Inscripciones
      ORDER BY fecha_inscripcion DESC
    `;

    db.all(sql, [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

// Obtener inscripción por ID
const findById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT id, alumna_id, horario_id, fecha_inscripcion
      FROM Inscripciones
      WHERE id = ?
    `;

    db.get(sql, [id], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
};

// Crear inscripción
const create = ({ alumna_id, horario_id, fecha_inscripcion }) => {
  const fecha = fecha_inscripcion || new Date().toISOString().slice(0, 10);

  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO Inscripciones (alumna_id, horario_id, fecha_inscripcion)
       VALUES (?, ?, ?)`,
      [alumna_id, horario_id, fecha],
      function (err) {
        if (err) return reject(err);
        resolve({
          id: this.lastID,
          alumna_id,
          horario_id,
          fecha_inscripcion: fecha,
        });
      }
    );
  });
};
// Reemplazar TODAS las inscripciones de una alumna
const replaceByAlumna = ({ alumna_id, horario_ids }) => {
  const fecha = new Date().toISOString().slice(0, 10);
  const ids = Array.isArray(horario_ids) ? horario_ids : [];

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run("BEGIN TRANSACTION");

      db.run(
        `DELETE FROM Inscripciones WHERE alumna_id = ?`,
        [alumna_id],
        (errDelete) => {
          if (errDelete) {
            db.run("ROLLBACK");
            return reject(errDelete);
          }

          if (ids.length === 0) {
            db.run("COMMIT");
            return resolve({ alumna_id, inserted: 0 });
          }

          const stmt = db.prepare(
            `INSERT INTO Inscripciones (alumna_id, horario_id, fecha_inscripcion)
             VALUES (?, ?, ?)`
          );

          let inserted = 0;

          ids.forEach((horario_id) => {
            stmt.run([alumna_id, horario_id, fecha], (errInsert) => {
              if (errInsert) {
                stmt.finalize(() => {
                  db.run("ROLLBACK");
                  reject(errInsert);
                });
              } else {
                inserted++;
              }
            });
          });

          stmt.finalize((errFinalize) => {
            if (errFinalize) {
              db.run("ROLLBACK");
              return reject(errFinalize);
            }

            db.run("COMMIT", (errCommit) => {
              if (errCommit) return reject(errCommit);
              resolve({ alumna_id, inserted });
            });
          });
        }
      );
    });
  });
};
// ¿Existe ya la inscripción alumna_id + horario_id?
const existsByAlumnaHorario = (alumna_id, horario_id) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 1 as one
      FROM Inscripciones
      WHERE alumna_id = ? AND horario_id = ?
      LIMIT 1
    `;
    db.get(sql, [alumna_id, horario_id], (err, row) => {
      if (err) return reject(err);
      resolve(Boolean(row));
    });
  });
};

// Eliminar inscripción
const remove = (id) => {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM Inscripciones WHERE id = ?`, [id], function (err) {
      if (err) return reject(err);
      resolve({ changes: this.changes });
    });
  });
};

module.exports = {
  findAll,
  findById,
  create,
  replaceByAlumna,
  existsByAlumnaHorario,
  remove,
};
