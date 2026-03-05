const repo = require("../repositories/pagos.repository");

// GET /api/pagos?mes=YYYY-MM
const getAll = (mes) => repo.findAll(mes);

const getById = (id) => repo.findById(id);

const createPago = (pago) => repo.create(pago);

const updatePago = (id, body) => repo.update(id, body);

const deletePago = (id) => repo.remove(id);

module.exports = { getAll, getById, createPago, updatePago, deletePago };
