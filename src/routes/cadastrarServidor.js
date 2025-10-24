var express = require("express");
var router = express.Router();

var cadastroServidorController = require("../controllers/cadastroServidorController.js");

router.post("/cadastrar", function (req, res) {
    cadastroServidorController.cadastrarServidor(req, res);
});

router.get("/exibeLayout", function (req, res) {
    cadastroServidorController.exibeLayout(req, res);
});

router.get("/exibeLayout/:idEmpresa", function (req, res) {
    cadastroServidorController.exibeLayout(req, res);
});

module.exports = router;