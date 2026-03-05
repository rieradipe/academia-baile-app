const service = require("../services/pagos.service");

// GET /api/pagos?mes=YYYY-MM
const getAll = async (req, res) => {
  try {
    const { mes } = req.query; // opcional
    const pagos = await service.getAll(mes);
    res.json(pagos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/pagos/:id
const getById = async (req, res) => {
  try {
    const pago = await service.getById(req.params.id);
    if (!pago) return res.status(404).json({ error: "Pago no encontrado" });
    res.json(pago);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/pagos
const create = async (req, res) => {
  try {
    const result = await service.createPago(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/pagos/:id
const update = async (req, res) => {
  try {
    const result = await service.updatePago(req.params.id, req.body);
    if (result.changes === 0)
      return res.status(404).json({ error: "Pago no encontrado" });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/pagos/:id
const remove = async (req, res) => {
  try {
    const result = await service.deletePago(req.params.id);
    if (result.changes === 0)
      return res.status(404).json({ error: "Pago no encontrado" });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
