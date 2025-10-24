var express = require("express");
var router = express.Router();

var cadastroServidorController = require("../controllers/cadastroServidorController.js");

router.post("/cadastrar", function (req, res) {
    cadastroServidorController.cadastrarServidor(req, res);
});

router.post("/exibirLayout", function (req, res) {
    cadastroServidorController.exibirLayout(req, res);
});

module.exports = router;