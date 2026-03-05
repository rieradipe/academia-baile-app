const service = require("../services/inscripciones.service");

const getAll = async (req, res) => {
  try {
    const inscripciones = await service.getAll();
    res.json(inscripciones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const inscripcion = await service.getById(req.params.id);
    if (!inscripcion)
      return res.status(404).json({ error: "Inscripción no encontrada" });
    res.json(inscripcion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const result = await service.createInscripcion(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const result = await service.deleteInscripcion(req.params.id);
    if (result.changes === 0)
      return res.status(404).json({ error: "Inscripción no encontrada" });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const replaceByAlumna = async (req, res) => {
  try {
    const { alumna_id, horario_ids } = req.body;

    if (!alumna_id || !Array.isArray(horario_ids)) {
      return res.status(400).json({
        error: "alumna_id y horario_ids[] son obligatorios",
      });
    }

    const result = await service.replaceByAlumna({
      alumna_id,
      horario_ids,
    });

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { getAll, getById, create, replaceByAlumna, remove };
