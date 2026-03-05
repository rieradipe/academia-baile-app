const express = require("express");
const controller = require("../controllers/inscripciones.controller");

const router = express.Router();

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.post("/replace", controller.replaceByAlumna);
router.delete("/:id", controller.remove);

module.exports = router;
