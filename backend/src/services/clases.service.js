const repo = require("../repositories/clases.repository");

const getAll = () => repo.findAll();
const getById = (id) => repo.findById(id);
const createClase = (clase) => repo.create(clase);
const updateClase = (id, clase) => repo.update(id, clase);
const deleteClase = (id) => repo.remove(id);

module.exports = {
  getAll,
  getById,
  createClase,
  updateClase,
  deleteClase,
};
