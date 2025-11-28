var express = require("express");
var router = express.Router();

var dashTemperaturaController = require("../controllers/dashTemperaturaController");


router.get("/buscarParametros/:idEmpresa", (req, res) => {
    dashTemperaturaController.buscarParametros(req, res);
});

module.exports = router;