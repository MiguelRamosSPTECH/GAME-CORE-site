var express = require("express");
var router = express.Router();

var layoutsController = require("../controllers/layoutsController");

router.get("/buscar/:idEmpresa", (req, res) => {
    layoutsController.buscar(req, res);
});
router.get("/buscarCompleto/:idEmpresa", (req, res) => {
    layoutsController.buscarCompleto(req, res);
});

module.exports = router;
