const repo = require("../repositories/clases.repository");

const getAll = (estado) => repo.findAll(estado);
const getById = (id) => repo.findById(id);
const createClase = async (clase) => {
  const nuevaClase = await repo.create(clase);

  await repo.createHorarioForClase(nuevaClase.id, clase);

  return nuevaClase;
};
const updateClase = (id, clase) => repo.update(id, clase);
const deleteClase = (id) => repo.remove(id);

module.exports = {
  getAll,
  getById,
  createClase,
  updateClase,
  deleteClase,
};
