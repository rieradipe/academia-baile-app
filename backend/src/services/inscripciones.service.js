const repo = require("../repositories/inscripciones.repository");
const pagosService = require("./pagos.service");

/**
 * Obtener todas las inscripciones
 */
const getAll = () => repo.findAll();

/**
 * Obtener inscripción por ID
 */
const getById = (id) => repo.findById(id);

/**
 * Crear inscripción
 * - Evita duplicados
 * - Protegido también por índice UNIQUE en BD
 * - Genera pago inicial
 */
const createInscripcion = async (inscripcion) => {
  const { alumna_id, horario_id } = inscripcion;

  if (!alumna_id || !horario_id)
    throw new Error("alumna_id y horario_id son obligatorios");

  // 🔎 Validación rápida (sin traer toda la tabla)
  const existe = await repo.existsByAlumnaHorario(alumna_id, horario_id);
  if (existe) throw new Error("La alumna ya está inscrita en este horario");

  let result;

  try {
    result = await repo.create(inscripcion);
  } catch (err) {
    // 🛡 Protección extra por índice UNIQUE
    if (String(err?.message || "").includes("UNIQUE constraint failed")) {
      throw new Error("La alumna ya está inscrita en este horario");
    }
    throw err;
  }

  // 💰 Crear pago inicial
  await pagosService.createPago({
    alumna_id,
    fecha: new Date().toISOString().slice(0, 10),
    importe: 50,
    concepto: "Matrícula + primer mes",
    estado: "pendiente",
  });

  return result;
};

/**
 * Reemplazar TODAS las inscripciones de una alumna
 */
const replaceByAlumna = async ({ alumna_id, horario_ids }) => {
  if (!alumna_id) throw new Error("alumna_id requerido");

  if (!Array.isArray(horario_ids))
    throw new Error("horario_ids debe ser un array");

  // 🔒 Eliminar duplicados en caso de bug de frontend
  const idsUnicos = [...new Set(horario_ids)];

  return repo.replaceByAlumna({
    alumna_id,
    horario_ids: idsUnicos,
  });
};

/**
 * Eliminar inscripción individual
 */
const deleteInscripcion = (id) => repo.remove(id);

module.exports = {
  getAll,
  getById,
  createInscripcion,
  replaceByAlumna,
  deleteInscripcion,
};
