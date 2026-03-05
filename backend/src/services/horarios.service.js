const repo = require("../repositories/horarios.repository");

const getAll = () => repo.findAll();
const getById = (id) => repo.findById(id);
const createhorario = (horario) => repo.create(horario);
const updatehorario = (id, horario) => repo.update(id, horario);
const deletehorario = (id) => repo.remove(id);

module.exports = {
  getAll,
  getById,
  createhorario,
  updatehorario,
  deletehorario,
};
