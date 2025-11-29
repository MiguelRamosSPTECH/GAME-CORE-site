var express = require("express");
var router = express.Router();
const path = require('path');

var dashTemperaturaController = require("../controllers/dashTemperaturaController");

router.get("/buscarParametros/:idEmpresa", (req, res) => {
    dashTemperaturaController.buscarParametros(req, res);
});

router.get('/dados_pedro/:arquivo', (req, res) => {
    dashTemperaturaController.lerArquivoPedroProc(req, res);
});

router.get('/dados_pedro/:arquivo', (req, res) => {
    dashTemperaturaController.lerArquivoPedroMed(req, res);
});

module.exports = router;