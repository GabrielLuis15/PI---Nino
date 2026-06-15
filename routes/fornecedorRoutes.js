const express = require("express");
const router = express.Router();
const controller = require("../controllers/fornecedorController");

router.get("/", controller.index);
router.post("/salvar", controller.salvar);
router.get('/editar/:id', controller.formEditar);
router.post('/editar/:id', controller.editar);
router.get('/excluir/:id', controller.excluir);

module.exports = router;