const alumnasRepository = require("../repositories/alumnas.repository");

const getAll = (activa) => alumnasRepository.findAll(activa);
const getById = (id) => alumnasRepository.findById(id);
const createalumna = (alumna) => alumnasRepository.create(alumna);
const updatealumna = (id, alumna) => alumnasRepository.update(id, alumna);
const setActiva = (id, activa) => alumnasRepository.update(id, { activa });

const deletealumna = (id) => alumnasRepository.remove(id);

module.exports = {
  getAll,
  getById,
  createalumna,
  updatealumna,
  setActiva,
  deletealumna,
};
