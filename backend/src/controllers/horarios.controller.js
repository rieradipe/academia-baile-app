const service = require("../services/horarios.service");

// GET /api/horarios
const getAll = async (req, res) => {
  try {
    const horario = await service.getAll();
    res.json(horario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/horarios/:id
const getById = async (req, res) => {
  try {
    const horario = await service.getById(req.params.id);
    if (!horario)
      return res.status(404).json({ error: "horario no encontrado" });
    res.json(horario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/horarios
const create = async (req, res) => {
  try {
    const result = await service.createhorario(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/horarios/:id
const update = async (req, res) => {
  try {
    const result = await service.updatehorario(req.params.id, req.body);
    if (result.changes === 0)
      return res.status(404).json({ error: "horario no encontrado" });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/horarios/:id
const remove = async (req, res) => {
  try {
    const result = await service.deletehorario(req.params.id);
    if (result.changes === 0)
      return res.status(404).json({ error: "horario no encontrado" });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
