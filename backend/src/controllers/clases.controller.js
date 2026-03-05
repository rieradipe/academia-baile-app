const service = require("../services/clases.service");

// GET /api/clases
const getAll = async (req, res) => {
  try {
    const clases = await service.getAll();
    res.json(clases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/clases/:id
const getById = async (req, res) => {
  try {
    const clase = await service.getById(req.params.id);
    if (!clase) return res.status(404).json({ error: "Clase no encontrada" });
    res.json(clase);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/clases
const create = async (req, res) => {
  try {
    const result = await service.createClase(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/clases/:id
const update = async (req, res) => {
  try {
    const result = await service.updateClase(req.params.id, req.body);
    if (result.changes === 0)
      return res.status(404).json({ error: "Clase no encontrada" });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/clases/:id
const remove = async (req, res) => {
  try {
    const result = await service.deleteClase(req.params.id);
    if (result.changes === 0)
      return res.status(404).json({ error: "Clase no encontrada" });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
