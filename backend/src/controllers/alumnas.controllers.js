const service = require("../services/alumnas.service");

// GET /api/alumnas
const getAll = async (req, res) => {
  try {
    const activa = req.query.activa ?? "1"; // por defecto activas
    const alumnas = await service.getAll(activa);
    res.json(alumnas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/alumnas/:id
const getById = async (req, res) => {
  try {
    const alumna = await service.getById(req.params.id); // incluye inscripciones
    if (!alumna) return res.status(404).json({ error: "Alumna no encontrada" });
    res.json(alumna);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/alumnas
const create = async (req, res) => {
  try {
    // req.body puede incluir: nombre, apellidos, telefono, email, fecha_nacimiento, observaciones, clases: [id,...]
    const result = await service.createalumna(req.body);
    res.status(201).json(result); // devuelve alumna con inscripciones
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/alumnas/:id
const update = async (req, res) => {
  try {
    const result = await service.updatealumna(req.params.id, req.body);
    if (!result) return res.status(404).json({ error: "Alumna no encontrada" });
    res.json(result); // devuelve alumna con inscripciones actualizadas
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const setActiva = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const activa = req.body?.activa;

    if (!id || (activa !== 0 && activa !== 1)) {
      return res.status(400).json({ error: "activa debe ser 0 o 1" });
    }

    const result = await service.setActiva(id, activa);

    if (result.changes === 0)
      return res.status(404).json({ error: "Alumna no encontrada" });

    res.json({ ok: true, id, activa });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/alumnas/:id
const remove = async (req, res) => {
  try {
    const result = await service.deletealumna(req.params.id);
    if (result.changes === 0)
      return res.status(404).json({ error: "Alumna no encontrada" });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getById, create, update, setActiva, remove };
