const db = require("../db/db");

/**
 * Helper: agrupa filas (alumna + posibles horarios) en un array de alumnas con horarios[]
 */
const groupAlumnas = (rows) => {
  const map = {};

  for (const row of rows) {
    if (!map[row.id]) {
      map[row.id] = {
        id: row.id,
        nombre: row.nombre,
        apellidos: row.apellidos,
        dni: row.dni ?? null,
        numero_ss: row.numero_ss ?? null,
        telefono: row.telefono,
        email: row.email,
        fecha_nacimiento: row.fecha_nacimiento,
        fecha_inscripcion: row.fecha_inscripcion,
        observaciones: row.observaciones,
        activa: row.activa,
        pagado: row.pagado,
        horarios: [],
      };
    }

    if (row.horario_id) {
      map[row.id].horarios.push({
        inscripcion_id: row.inscripcion_id,
        horario_id: row.horario_id,
        dia: row.dia,
        hora_inicio: row.hora_inicio,
        hora_fin: row.hora_fin,
        descripcion: row.horario_descripcion,
        activa: row.horario_activa,
        clase_id: row.clase_id,
        clase_nombre: row.clase_nombre,
      });
    }
  }

  return Object.values(map);
};

/**
 * GET todas las alumnas con horarios
 * activa:
 *  - "1" / 1  -> solo activas
 *  - "0" / 0  -> solo inactivas
 *  - "all"    -> todas
 */
const findAll = (activa = "1") => {
  return new Promise((resolve, reject) => {
    let where = "";
    const params = [];

    if (activa === "1" || activa === 1 || activa === true) {
      where = "WHERE a.activa = 1";
    } else if (activa === "0" || activa === 0 || activa === false) {
      where = "WHERE a.activa = 0";
    }

    const sql = `
      SELECT 
        a.*,
        i.id AS inscripcion_id,
        i.horario_id,
        h.dia,
        h.hora_inicio,
        h.hora_fin,
        h.descripcion AS horario_descripcion,
        h.activa AS horario_activa,
        c.id AS clase_id,
        c.nombre AS clase_nombre
      FROM alumnas a
      LEFT JOIN Inscripciones i ON i.alumna_id = a.id
      LEFT JOIN Horarios h ON h.id = i.horario_id
      LEFT JOIN Clases c ON c.id = h.clase_id
      ${where}
      ORDER BY a.id
    `;

    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(groupAlumnas(rows));
    });
  });
};

/**
 * GET alumna por ID con horarios
 */
const findById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        a.*,
        i.id AS inscripcion_id,
        i.horario_id,
        h.dia,
        h.hora_inicio,
        h.hora_fin,
        h.descripcion AS horario_descripcion,
        h.activa AS horario_activa,
        c.id AS clase_id,
        c.nombre AS clase_nombre
      FROM alumnas a
      LEFT JOIN Inscripciones i ON i.alumna_id = a.id
      LEFT JOIN Horarios h ON h.id = i.horario_id
      LEFT JOIN Clases c ON c.id = h.clase_id
      WHERE a.id = ?
    `;

    db.all(sql, [id], (err, rows) => {
      if (err) return reject(err);
      if (!rows || rows.length === 0) return resolve(null);
      resolve(groupAlumnas(rows)[0]);
    });
  });
};

/**
 * POST crear alumna
 * Campos clave: nombre, apellidos, dni, numero_ss, telefono
 * (Los demás opcionales se guardan si vienen)
 */
const create = (alumna) => {
  const {
    nombre,
    apellidos,
    dni = null,
    numero_ss = null,
    telefono = null,
    email = null,
    fecha_nacimiento = null,
    fecha_inscripcion = new Date().toISOString().slice(0, 10),
    observaciones = null,
    activa = 1,
    pagado = 0,
  } = alumna;

  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO alumnas
      (nombre, apellidos, dni, numero_ss, telefono, email, fecha_nacimiento, fecha_inscripcion, observaciones, activa, pagado)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(
      sql,
      [
        nombre,
        apellidos,
        dni,
        numero_ss,
        telefono,
        email,
        fecha_nacimiento,
        fecha_inscripcion,
        observaciones,
        activa,
        pagado,
      ],
      function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID });
      }
    );
  });
};

/**
 * PUT actualizar alumna (parcial)
 */
const update = (id, alumna) => {
  const allowed = new Set([
    "nombre",
    "apellidos",
    "dni",
    "numero_ss",
    "telefono",
    "email",
    "fecha_nacimiento",
    "fecha_inscripcion",
    "observaciones",
    "activa",
    "pagado",
  ]);

  const fields = [];
  const values = [];

  for (const key in alumna) {
    if (!allowed.has(key)) continue;
    fields.push(`${key} = ?`);
    values.push(alumna[key]);
  }

  if (fields.length === 0) return Promise.resolve({ changes: 0 });

  values.push(id);

  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE alumnas SET ${fields.join(", ")} WHERE id = ?`,
      values,
      function (err) {
        if (err) return reject(err);
        resolve({ changes: this.changes });
      }
    );
  });
};

/**
 * DELETE eliminar alumna (y sus relaciones)
 * - borra primero Inscripciones de esa alumna
 * - luego borra la alumna
 * (Pagos los dejamos, o los borras si quieres. Yo NO los borraría por si necesitas histórico)
 */
const remove = (id) => {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM Inscripciones WHERE alumna_id = ?`, [id], (err1) => {
      if (err1) return reject(err1);

      db.run(`DELETE FROM alumnas WHERE id = ?`, [id], function (err2) {
        if (err2) return reject(err2);
        resolve({ changes: this.changes });
      });
    });
  });
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};
